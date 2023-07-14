import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as kavenegar from 'kavenegar';
const api = kavenegar.KavenegarApi({
  apikey:
    '4F6E776F464271786B5535446C2B483959344B65567464444F6F4F6B363257365868624F30726D6173316B3D',
});
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeprm/entities/user.model';
import { Repository } from 'typeorm';
import { LoginDto, SignupDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Code } from '../typeprm/entities/code.model';
import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Code) private codeRepo: Repository<Code>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: {
        number: dto.number,
      },
    });

    if (user) {
      delete user.password;
      console.log(user);
    } else {
      throw new NotFoundException();
    }
    if (!dto.code) {
      const otpCode = await this.otpCodeGenerator();
      const createdOtpCode = await this.codeRepo.create({
        code: otpCode,
        user: user,
      });
      const savedOtpCode = await this.codeRepo.save(createdOtpCode);
      api.Send(
        {
          message: savedOtpCode.code,
          sender: '10008663',
          receptor: '09941909765',
        },
        function (response, status) {
          console.log(response);
          console.log(status);
        },
      );
      return { otp_code: savedOtpCode.code };
    } else {
      const validOtp = await this.codeRepo.findOne({
        where: {
          user: user,
          is_used: false,
        },
      });
      if (validOtp) {
        console.log(user.id);
        console.log(user.number);
        const accessToken = await this.signToken(user.id, user.number);
        await this.codeRepo.update(validOtp, { is_used: true });
        return { access_token: accessToken };
      } else {
        return 'your code has been expired or not valid';
      }
    }
  }

  async signup(dto: SignupDto) {
    try {
      const user = await this.userRepo.findOne({
        where: [{ number: dto.number }, { username: dto.username }],
      });
      if (user) {
        throw new HttpException(
          'username or number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hash = await argon.hash(dto.password);
      const createdUser = this.userRepo.create({
        username: dto.username,
        password: hash,
        number: dto.number,
      });
      const savedUser = await this.userRepo.save(createdUser);
      delete savedUser.password;
      console.log(savedUser);
      return { your_info: savedUser };
    } catch (err: any) {
      return err;
    }
  }
  async signToken(userId: number, number: number): Promise<string> {
    const payload = {
      sub: userId,
      number,
    };
    const secret = this.config.get('JWT_SECRET');
    //console.log(secret);
    return this.jwt.signAsync(payload, { expiresIn: '15m', secret: secret });
  }

  async otpCodeGenerator(): Promise<number> {
    let validatedOtp: number = null;
    while (true) {
      const generatedOtp = this.RandomCodeGenerator();
      const otpCheck = await this.codeRepo.findOne({
        where: { code: generatedOtp },
      });
      if (!otpCheck) {
        validatedOtp = generatedOtp;
        break;
      }
    }
    return validatedOtp;
  }

  RandomCodeGenerator() {
    const min = 1000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeprm/entities/user.model';
import { Repository } from 'typeorm';
import { LoginDto, SignupDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Code } from '../typeprm/entities/code.model';

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
    const createdUser = this.userRepo.create({ ...dto });
    try {
      const savedUser = await this.userRepo.save(createdUser);
      console.log(savedUser);
      return { your_info: savedUser };
    } catch (err: any) {
      if (err.code == '1') {
      }
    }
  }
  async signToken(userId: number, number: number): Promise<string> {
    const payload = {
      sub: userId,
      number,
    };
    const secret = this.config.get('JWT_SECRET');
    console.log(secret);
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

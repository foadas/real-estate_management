import {
  IsNotEmpty,
  IsNumber, IsOptional, IsPhoneNumber,
  IsPositive,
  IsString, Max, Min,
  MinLength
} from 'class-validator';
import { PrimaryGeneratedColumn } from "typeorm";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  number: string;
}
export class LoginDto {
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  number: string;

  @IsOptional()
  @IsNumber()
  code: number;
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeprm/entities/user.model';
import { Code } from '../typeprm/entities/code.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { Property } from '../typeprm/entities/property.model';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Code, Property]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

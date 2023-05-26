import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeprm/entities/user.model';
import { ConfigModule } from '@nestjs/config';
import { Code } from './typeprm/entities/code.model';
import { Property } from './typeprm/entities/property.model';
import database, { typeOrmConfigAsync } from "./config/database.config";
import TypeormConfig from "./config/database.config";
@Module({
  imports: [
    ConfigModule.forRoot(),
    PropertyModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

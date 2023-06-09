import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from '../config/database.config';
import { TicketModule } from './ticket/ticket.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    PropertyModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { IsNotEmpty, IsString } from 'class-validator';

export class TicketDto {
  @IsNotEmpty()
  @IsString()
  subject: string;
  @IsNotEmpty()
  @IsString()
  body: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class PropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  location: string;
  @IsNotEmpty()
  @IsString()
  size: string;
}

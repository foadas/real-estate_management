import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  location?: string;
  @IsString()
  @IsOptional()
  size?: string;
}

import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name!: string;
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(3)
  password!: string;
}

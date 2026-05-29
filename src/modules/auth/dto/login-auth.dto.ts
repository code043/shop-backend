import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(3)
  password!: string;
}

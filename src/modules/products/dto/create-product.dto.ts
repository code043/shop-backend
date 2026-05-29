import {
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsString()
  slug!: string;

  @IsString()
  stock!: number;

  @IsBoolean()
  isActive!: boolean;
  @IsString()
  @IsOptional()
  categoryId?: string;
}

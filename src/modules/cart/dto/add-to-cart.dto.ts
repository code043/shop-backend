import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class AddToCartDto {
  @IsString()
  productId: string;
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

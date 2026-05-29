import { Body, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Auth } from 'src/decorators/auth.users.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post('add')
  add(@Auth('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto.productId, dto.quantity, userId);
  }

  @Get()
  getCart(@Auth('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete()
  remove(@Auth('id') userId: string, @Body('productId') productId: string) {
    return this.cartService.removeItem(productId, userId);
  }
}

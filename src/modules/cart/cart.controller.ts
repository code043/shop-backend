import { Body, Controller, Get, Post, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  add(@Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto.productId, dto.quantity);
  }

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Delete()
  remove(@Body('productId') productId: string) {
    return this.cartService.removeItem(productId);
  }
}

import { Controller, Post, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/decorators/auth.users.decorator';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('checkout')
  checkout(@Auth('id') userId: string) {
    return this.orderService.checkout(userId);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }
}

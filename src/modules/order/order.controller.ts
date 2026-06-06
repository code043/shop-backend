import { Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/decorators/auth.users.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Auth('id') userId: string) {
    return this.orderService.checkout(userId);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Auth('id') userId: string) {
    return this.orderService.findOne(id, userId);
  }
}

import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment/payment.service';
import { Auth } from 'src/decorators/auth.users.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Auth('id') userId: string) {
    const order = await this.orderService.checkout(userId);
    const payment = await this.paymentService.createCheckout(order);
    return { order, ...payment };
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }
}

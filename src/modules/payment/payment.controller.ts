import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('checkout')
  create(@Body('orderId') orderId: string) {
    return this.paymentService.createCheckout(orderId);
  }

  @Post('webhook')
  webhook(@Req() req: Request) {
    return this.paymentService.handleWebhook(req.body);
  }
}

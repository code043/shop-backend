import { Controller, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('webhook')
  async webhook(@Req() req: any) {
    await this.paymentService.handleWebhook(req.body);
    return { received: true };
  }
}

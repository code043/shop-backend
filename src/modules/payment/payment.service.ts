import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from '../order/order.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async createCheckout(orderId: string) {
    const order = await this.orderService.findOne(orderId);

    if (order.status !== 'PENDING') {
      throw new Error('Order is not available for payment');
    }

    await this.orderService.markAsProcessing(orderId);

    return {
      url: `http://localhost:8080/payment/${orderId}`, // fake
    };
  }

  async handleWebhook(event: any) {
    if (!event || !event.type) return;

    if (event.type === 'payment.success') {
      const orderId = event.data?.orderId;

      if (!orderId) return;

      const order = await this.orderService.findOne(orderId);

      if (order.status === 'PAID') {
        return;
      }

      return this.orderService.markAsPaid(orderId);
    }
  }
}

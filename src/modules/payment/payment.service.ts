import { OrderService } from '../order/order.service';
import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe = new (Stripe as any)(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia',
  });

  constructor(private orderService: OrderService) {}

  async createCheckout(orderId: string) {
    const order = await this.orderService.findOne(orderId);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),

      metadata: {
        orderId,
      },

      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return { url: session.url };
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

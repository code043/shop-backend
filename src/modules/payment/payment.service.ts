import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as Stripe from 'stripe';

type OrderWithItems = {
  id: string;
  items: {
    price: number;
    quantity: number;
    product: { name: string };
  }[];
};

@Injectable()
export class PaymentService {
  private stripe = new (Stripe as any)(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia',
  }) as Stripe.Stripe;

  constructor(private prisma: PrismaService) {}

  async createCheckout(order: OrderWithItems) {
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
        orderId: order.id,
      },

      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return { url: session.url };
  }

  async handleWebhook(event: any) {
    if (!event || !event.type) {
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return;
      }

      const result = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });

      return result;
    }
  }
}

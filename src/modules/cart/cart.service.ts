import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst();

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async addToCart(productId: string, quantity: number, userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async removeItem(productId: string, userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  }
}

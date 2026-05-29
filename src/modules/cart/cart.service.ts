import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart() {
    let cart = await this.prisma.cart.findFirst();

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {},
      });
    }

    return cart;
  }

  async addToCart(productId: string, quantity: number) {
    const cart = await this.getOrCreateCart();

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

  async getCart() {
    const cart = await this.getOrCreateCart();

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

  async removeItem(productId: string) {
    const cart = await this.getOrCreateCart();

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

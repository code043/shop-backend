import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/modules/cart/cart.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [PrismaModule, CartModule, PaymentModule],
  providers: [OrderService, CartService, PrismaService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}

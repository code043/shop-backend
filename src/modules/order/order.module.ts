import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/modules/cart/cart.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Module({
  imports: [PrismaModule, CartModule],
  providers: [OrderService, CartService, PrismaService],
  controllers: [OrderController],
})
export class OrderModule {}

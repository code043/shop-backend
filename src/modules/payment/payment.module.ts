import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [OrderModule],
  providers: [PaymentService, PrismaService],
  controllers: [PaymentController],
})
export class PaymentModule {}

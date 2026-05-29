import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        stock: dto.stock,
        isActive: true,
        ...(dto.categoryId && { categoryId: dto.categoryId }),
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOneById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }
  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug },
    });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}

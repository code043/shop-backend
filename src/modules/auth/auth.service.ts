import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const { password, email } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists!');
    }

    const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT));

    return this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });
  }
  async login(loginAuthDto: LoginAuthDto) {
    const { password, email } = loginAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const pass = bcrypt.compareSync(password, user.password);

    if (!pass) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      jti: crypto.randomUUID(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES as StringValue,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES as StringValue,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    return {
      user: user.id,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token!');
    }

    let payload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token mismatch!');
    }

    const newAccessToken = this.jwtService.sign(
      {
        sub: user.id,
        role: user.role,
        jti: crypto.randomUUID(),
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES as StringValue,
      },
    );

    const newRefreshToken = this.jwtService.sign(
      {
        sub: user.id,
        role: user.role,
        jti: crypto.randomUUID(),
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES as StringValue,
      },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
  async getAuthenticatedUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }
}

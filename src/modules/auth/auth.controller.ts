import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { Auth } from 'src/decorators/auth.users.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginAuthDto);

    return {
      user,
      access_token,
      refresh_token,
    };
  }
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token is missing!');
    }

    const refreshToken = authHeader.split(' ')[1];

    const result = await this.authService.refreshToken(refreshToken);

    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Auth('id') id: string) {
    return this.authService.getAuthenticatedUser(id);
  }
}

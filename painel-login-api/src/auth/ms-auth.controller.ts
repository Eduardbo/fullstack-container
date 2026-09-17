import { Body, Controller, Post, Res, Get, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class MsAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(

    @Body() body: LoginRequestDto,
    
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(body.email, body.password);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      token,
      user: {
        email: body.email,
      },
      session: {
        name: 'session',
        httpOnly: true,
        secure: isProduction,
      },
    };
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto) {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );

    return {
      success: true,
      user,
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async findAllUsers() {
    return {
      success: true,
      user: await this.authService.findAllUsers(),
    };
  }
}

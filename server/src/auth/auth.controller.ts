import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockAuthGuard } from './guards/mock-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: { email: string; role?: string }) {
    // Mock login: find user by email or create a dummy one if it doesn't exist
    let user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      // Create a default user for demonstration
      user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: 'password', // In a real app, this would be hashed
          role: body.role || 'EMPLOYEE',
        },
      });
    } else if (body.role && user.role !== body.role) {
      // Update role if explicitly requested and different
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: body.role },
      });
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: 'mock-jwt-token-' + user.id,
    };
  }

  @UseGuards(MockAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
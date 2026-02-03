import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
    constructor(private prisma: PrismaService) { }

    @Post('login')
    async login(@Body() body: { email: string }) {
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
                    role: 'EMPLOYEE',
                }
            });
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: 'mock-jwt-token-' + user.id,
        };
    }
}

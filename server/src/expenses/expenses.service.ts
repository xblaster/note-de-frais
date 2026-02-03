import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string) {
        // If user has no expenses, create some dummy ones for demonstration
        const expenses = await this.prisma.expense.findMany({
            where: { userId },
        });

        if (expenses.length === 0) {
            await this.prisma.expense.createMany({
                data: [
                    {
                        amount: 42.5,
                        vendor: 'Starbucks',
                        date: new Date(),
                        userId,
                    },
                    {
                        amount: 15.0,
                        vendor: 'Uber',
                        date: new Date(),
                        userId,
                    },
                    {
                        amount: 120.99,
                        vendor: 'Amazon',
                        date: new Date(),
                        userId,
                        status: 'SUBMITTED',
                    },
                ],
            });
            return this.prisma.expense.findMany({ where: { userId } });
        }

        return expenses;
    }
}

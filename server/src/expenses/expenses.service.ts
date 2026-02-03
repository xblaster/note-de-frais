import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

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
            status: 'DRAFT',
            description: 'Café équipe',
            category: 'Repas',
          },
          {
            amount: 15.0,
            vendor: 'Uber',
            date: new Date(),
            userId,
            status: 'REJECTED',
            rejectionReason: 'Justificatif illisible',
            description: 'Trajet bureau-client',
            category: 'Transport',
          },
          {
            amount: 120.99,
            vendor: 'Amazon',
            date: new Date(),
            userId,
            status: 'SUBMITTED',
            description: 'Souris ergonomique',
            category: 'Fournitures',
          },
          {
            amount: 550.0,
            vendor: 'Hotel Marriott',
            date: new Date(Date.now() - 86400000 * 2),
            userId,
            status: 'APPROVED',
            approvedAt: new Date(Date.now() - 86400000),
            approvedBy: 'manager@example.com',
            description: "Voyage d'affaires Lyon",
            category: 'Hébergement',
          },
        ],
      });
      return this.prisma.expense.findMany({ where: { userId } });
    }

    return expenses;
  }

  async create(data: {
    amount: number;
    date: string;
    vendor?: string;
    userId: string;
    screenshotUrl?: string;
  }) {
    return this.prisma.expense.create({
      data: {
        amount: data.amount,
        date: new Date(data.date),
        vendor: data.vendor,
        userId: data.userId,
        screenshotUrl: data.screenshotUrl,
        status: 'DRAFT',
      },
    });
  }
}

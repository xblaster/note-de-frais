import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) { }

  async findAll(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
    });
  }

  async remove(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    // Only allow deletion for DRAFT or REJECTED status
    if (expense.status !== 'DRAFT' && expense.status !== 'REJECTED') {
      throw new Error('Only draft or rejected expenses can be deleted');
    }

    return this.prisma.expense.delete({
      where: { id },
    });
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

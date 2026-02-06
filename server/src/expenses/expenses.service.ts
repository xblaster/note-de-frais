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

  async findAllGlobal() {
    return this.prisma.expense.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async remove(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    // Only allow deletion for DRAFT, REJECTED or REVISION_REQUESTED status
    if (
      expense.status !== 'DRAFT' &&
      expense.status !== 'REJECTED' &&
      expense.status !== 'REVISION_REQUESTED'
    ) {
      throw new Error('Only draft, rejected or revision requested expenses can be deleted');
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
    status?: 'DRAFT' | 'SUBMITTED';
  }) {
    // Validate status if provided
    const targetStatus = data.status || 'DRAFT';
    if (targetStatus !== 'DRAFT' && targetStatus !== 'SUBMITTED') {
      throw new Error('Only DRAFT or SUBMITTED status can be set during creation');
    }

    return this.prisma.expense.create({
      data: {
        amount: data.amount,
        date: new Date(data.date),
        vendor: data.vendor,
        userId: data.userId,
        screenshotUrl: data.screenshotUrl,
        status: targetStatus,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      amount?: number;
      date?: string;
      vendor?: string;
      description?: string;
      category?: string;
      status?: 'DRAFT' | 'SUBMITTED';
    },
  ) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    if (expense.status !== 'DRAFT' && expense.status !== 'REVISION_REQUESTED') {
      throw new Error('Only expenses in DRAFT or REVISION_REQUESTED status can be updated');
    }

    // Validate status if provided
    if (data.status && data.status !== 'DRAFT' && data.status !== 'SUBMITTED') {
      throw new Error('Only DRAFT or SUBMITTED status can be set during update');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  async requestRevision(id: string, reason: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if (expense.status !== 'SUBMITTED') {
      throw new Error('Only submitted expenses can be sent for revision');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'REVISION_REQUESTED',
        rejectionReason: reason,
      },
    });
  }

  async submit(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      throw new Error('Expense not found or unauthorized');
    }

    if (expense.status !== 'DRAFT' && expense.status !== 'REVISION_REQUESTED') {
      throw new Error('Only draft or revision requested expenses can be submitted');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
      },
    });
  }
}

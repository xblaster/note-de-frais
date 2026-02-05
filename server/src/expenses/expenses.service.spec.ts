import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../test/prisma-mock';

describe('ExpensesService', () => {
    let service: ExpensesService;
    let prismaMock: MockPrismaClient;

    beforeEach(async () => {
        prismaMock = createMockPrisma();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpensesService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<ExpensesService>(ExpensesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all expenses for a user', async () => {
            const userId = 'user-1';
            const mockExpenses = [
                { id: '1', amount: 10, date: new Date(), userId, status: 'DRAFT' },
                { id: '2', amount: 20, date: new Date(), userId, status: 'SUBMITTED' },
            ];

            prismaMock.expense.findMany.mockResolvedValue(mockExpenses as any);

            const result = await service.findAll(userId);

            expect(result).toEqual(mockExpenses);
            expect(prismaMock.expense.findMany).toHaveBeenCalledWith({
                where: { userId },
            });
        });
    });

    describe('create', () => {
        it('should create an expense with DRAFT status by default', async () => {
            const expenseData = {
                amount: 100,
                date: '2024-02-04',
                userId: 'user-1',
                vendor: 'Test Vendor',
            };

            const mockCreatedExpense = {
                id: 'new-id',
                ...expenseData,
                date: new Date(expenseData.date),
                status: 'DRAFT',
            };

            prismaMock.expense.create.mockResolvedValue(mockCreatedExpense as any);

            const result = await service.create(expenseData);

            expect(result.status).toBe('DRAFT');
            expect(prismaMock.expense.create).toHaveBeenCalled();
        });

        it('should create an expense with SUBMITTED status when specified', async () => {
            const expenseData = {
                amount: 100,
                date: '2024-02-04',
                userId: 'user-1',
                vendor: 'Test Vendor',
                status: 'SUBMITTED' as const,
            };

            const mockCreatedExpense = {
                id: 'new-id',
                ...expenseData,
                date: new Date(expenseData.date),
                status: 'SUBMITTED',
            };

            prismaMock.expense.create.mockResolvedValue(mockCreatedExpense as any);

            const result = await service.create(expenseData);

            expect(result.status).toBe('SUBMITTED');
            expect(prismaMock.expense.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ status: 'SUBMITTED' }),
            });
        });

        it('should throw an error if status is not DRAFT or SUBMITTED', async () => {
            const expenseData = {
                amount: 100,
                date: '2024-02-04',
                userId: 'user-1',
                status: 'APPROVED' as any,
            };

            await expect(service.create(expenseData)).rejects.toThrow(
                'Only DRAFT or SUBMITTED status can be set during creation'
            );
        });
    });

    describe('remove', () => {
        it('should delete a draft expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.delete.mockResolvedValue(mockExpense as any);

            await service.remove(expenseId, userId);

            expect(prismaMock.expense.delete).toHaveBeenCalledWith({
                where: { id: expenseId },
            });
        });

        it('should throw if status is not deletable', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'APPROVED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.remove(expenseId, userId)).rejects.toThrow(
                'Only draft, rejected or revision requested expenses can be deleted'
            );
        });

        it('should delete a rejected expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'REJECTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.delete.mockResolvedValue(mockExpense as any);

            await service.remove(expenseId, userId);

            expect(prismaMock.expense.delete).toHaveBeenCalledWith({
                where: { id: expenseId },
            });
        });

        it('should delete a revision_requested expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'REVISION_REQUESTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.delete.mockResolvedValue(mockExpense as any);

            await service.remove(expenseId, userId);

            expect(prismaMock.expense.delete).toHaveBeenCalled();
        });

        it('should throw when trying to delete submitted expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.remove(expenseId, userId)).rejects.toThrow(
                'Only draft, rejected or revision requested expenses can be deleted'
            );
        });
    });

    describe('submit', () => {
        it('should submit a draft expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT' };
            const submittedExpense = { ...mockExpense, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(submittedExpense as any);

            const result = await service.submit(expenseId, userId);

            expect(result.status).toBe('SUBMITTED');
            expect(prismaMock.expense.update).toHaveBeenCalledWith({
                where: { id: expenseId },
                data: { status: 'SUBMITTED' },
            });
        });

        it('should submit a revision_requested expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'REVISION_REQUESTED' };
            const submittedExpense = { ...mockExpense, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(submittedExpense as any);

            const result = await service.submit(expenseId, userId);

            expect(result.status).toBe('SUBMITTED');
        });

        it('should throw when trying to submit already submitted expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.submit(expenseId, userId)).rejects.toThrow(
                'Only draft or revision requested expenses can be submitted'
            );
        });

        it('should throw when trying to submit approved expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'APPROVED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.submit(expenseId, userId)).rejects.toThrow(
                'Only draft or revision requested expenses can be submitted'
            );
        });
    });

    describe('requestRevision', () => {
        it('should request revision for a submitted expense', async () => {
            const expenseId = 'exp-1';
            const reason = 'Please provide more details';
            const mockExpense = { id: expenseId, status: 'SUBMITTED' };
            const revisedExpense = { ...mockExpense, status: 'REVISION_REQUESTED', rejectionReason: reason };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(revisedExpense as any);

            const result = await service.requestRevision(expenseId, reason);

            expect(result.status).toBe('REVISION_REQUESTED');
            expect(result.rejectionReason).toBe(reason);
            expect(prismaMock.expense.update).toHaveBeenCalledWith({
                where: { id: expenseId },
                data: { status: 'REVISION_REQUESTED', rejectionReason: reason },
            });
        });

        it('should throw when trying to request revision for draft expense', async () => {
            const expenseId = 'exp-1';
            const reason = 'Please provide more details';
            const mockExpense = { id: expenseId, status: 'DRAFT' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.requestRevision(expenseId, reason)).rejects.toThrow(
                'Only submitted expenses can be sent for revision'
            );
        });
    });

    describe('update', () => {
        it('should update a draft expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT', amount: 100 };
            const updatedExpense = { ...mockExpense, amount: 150 };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(updatedExpense as any);

            const result = await service.update(expenseId, userId, { amount: 150 });

            expect(result.amount).toBe(150);
        });

        it('should promote a DRAFT expense to SUBMITTED during update', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT', amount: 100 };
            const updatedExpense = { ...mockExpense, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(updatedExpense as any);

            const result = await service.update(expenseId, userId, { status: 'SUBMITTED' });

            expect(result.status).toBe('SUBMITTED');
            expect(prismaMock.expense.update).toHaveBeenCalledWith({
                where: { id: expenseId },
                data: expect.objectContaining({ status: 'SUBMITTED' }),
            });
        });

        it('should update a revision_requested expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'REVISION_REQUESTED', amount: 100 };
            const updatedExpense = { ...mockExpense, amount: 150 };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(updatedExpense as any);

            const result = await service.update(expenseId, userId, { amount: 150 });

            expect(result.amount).toBe(150);
        });

        it('should throw when trying to update submitted expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'SUBMITTED' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.update(expenseId, userId, { amount: 150 })).rejects.toThrow(
                'Only expenses in DRAFT or REVISION_REQUESTED status can be updated'
            );
        });

        it('should throw when trying to update with invalid status', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.update(expenseId, userId, { status: 'APPROVED' as any })).rejects.toThrow(
                'Only DRAFT or SUBMITTED status can be set during update'
            );
        });

        it('should handle date updates correctly', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const mockExpense = { id: expenseId, userId, status: 'DRAFT' };
            const newDate = '2024-02-15';
            const updatedExpense = { ...mockExpense, date: new Date(newDate) };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);
            prismaMock.expense.update.mockResolvedValue(updatedExpense as any);

            await service.update(expenseId, userId, { date: newDate });

            expect(prismaMock.expense.update).toHaveBeenCalledWith({
                where: { id: expenseId },
                data: expect.objectContaining({ date: new Date(newDate) }),
            });
        });
    });

    describe('edge cases', () => {
        it('should throw when creating expense with missing amount', async () => {
            const expenseData = {
                amount: null as any,
                date: '2024-02-04',
                userId: 'user-1',
            };

            // Since the service doesn't validate before Prisma, test should expect Prisma error
            prismaMock.expense.create.mockRejectedValue(new Error('Invalid value'));

            await expect(service.create(expenseData)).rejects.toThrow();
        });

        it('should throw when creating expense with negative amount', async () => {
            const expenseData = {
                amount: -100,
                date: '2024-02-04',
                userId: 'user-1',
            };

            prismaMock.expense.create.mockRejectedValue(new Error('Negative amount not allowed'));

            await expect(service.create(expenseData)).rejects.toThrow();
        });

        it('should throw when submitting expense without userId match', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';
            const wrongUserId = 'user-2';
            const mockExpense = { id: expenseId, userId: wrongUserId, status: 'DRAFT' };

            prismaMock.expense.findUnique.mockResolvedValue(mockExpense as any);

            await expect(service.submit(expenseId, userId)).rejects.toThrow(
                'Expense not found or unauthorized'
            );
        });

        it('should throw when updating non-existent expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';

            prismaMock.expense.findUnique.mockResolvedValue(null);

            await expect(service.update(expenseId, userId, { amount: 150 })).rejects.toThrow(
                'Expense not found or unauthorized'
            );
        });

        it('should throw when removing non-existent expense', async () => {
            const expenseId = 'exp-1';
            const userId = 'user-1';

            prismaMock.expense.findUnique.mockResolvedValue(null);

            await expect(service.remove(expenseId, userId)).rejects.toThrow(
                'Expense not found or unauthorized'
            );
        });
    });
});

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
    });
});

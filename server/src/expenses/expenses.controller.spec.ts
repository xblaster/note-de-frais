import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { OllamaService } from '../ollama/ollama.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let expensesService: jest.Mocked<ExpensesService>;
  let ollamaService: jest.Mocked<OllamaService>;

  beforeEach(async () => {
    const mockExpensesService = {
      findAll: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      submit: jest.fn(),
      requestRevision: jest.fn(),
      update: jest.fn(),
    };

    const mockOllamaService = {
      analyzeReceipt: jest.fn(),
      isHealthy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
        {
          provide: OllamaService,
          useValue: mockOllamaService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get(ExpensesService);
    ollamaService = module.get(OllamaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return expenses for a user', async () => {
      const userId = 'user-1';
      const expectedExpenses = [{ id: '1', amount: 10, userId }];
      expensesService.findAll.mockResolvedValue(expectedExpenses as any);

      const result = await controller.findAll(userId);

      expect(result).toBe(expectedExpenses);
      expect(expensesService.findAll).toHaveBeenCalledWith(userId);
    });

    it('should handle userId as an array', async () => {
        const userId = ['user-1'];
        const expectedExpenses = [{ id: '1', amount: 10, userId: 'user-1' }];
        expensesService.findAll.mockResolvedValue(expectedExpenses as any);
  
        const result = await controller.findAll(userId);
  
        expect(result).toBe(expectedExpenses);
        expect(expensesService.findAll).toHaveBeenCalledWith('user-1');
      });

    it('should throw UnauthorizedException if userId is missing', async () => {
      await expect(controller.findAll(undefined as any)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('analyze', () => {
    it('should analyze a receipt file', async () => {
      const mockFile = {
        path: 'test/path/receipt.jpg',
        filename: 'receipt.jpg',
      } as any;
      const mockAnalysis = { vendor: 'Test Store', amount: 50, date: '2024-02-05' };
      ollamaService.analyzeReceipt.mockResolvedValue(mockAnalysis);

      const result = await controller.analyze(mockFile);

      expect(result).toEqual({
        ...mockAnalysis,
        screenshotUrl: '/uploads/receipt.jpg',
      });
      expect(ollamaService.analyzeReceipt).toHaveBeenCalledWith(mockFile.path);
    });

    it('should throw BadRequestException if file is missing', async () => {
      await expect(controller.analyze(undefined as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const mockFile = {
        filename: 'receipt.jpg',
      } as any;
      const body = {
        amount: '100.50',
        date: '2024-02-05',
        vendor: 'Test Vendor',
        userId: 'user-1',
        status: 'DRAFT' as const,
      };
      const expectedResult = { id: '1', ...body, amount: 100.5, screenshotUrl: '/uploads/receipt.jpg' };
      expensesService.create.mockResolvedValue(expectedResult as any);

      const result = await controller.create(mockFile, body);

      expect(result).toBe(expectedResult);
      expect(expensesService.create).toHaveBeenCalledWith({
        amount: 100.5,
        date: body.date,
        vendor: body.vendor,
        userId: body.userId,
        screenshotUrl: '/uploads/receipt.jpg',
        status: body.status,
      });
    });

    it('should create an expense without a file', async () => {
        const body = {
          amount: '100.50',
          date: '2024-02-05',
          vendor: 'Test Vendor',
          userId: 'user-1',
        };
        const expectedResult = { id: '1', ...body, amount: 100.5 };
        expensesService.create.mockResolvedValue(expectedResult as any);
  
        const result = await controller.create(undefined as any, body);
  
        expect(result).toBe(expectedResult);
        expect(expensesService.create).toHaveBeenCalledWith({
          amount: 100.5,
          date: body.date,
          vendor: body.vendor,
          userId: body.userId,
          screenshotUrl: undefined,
          status: undefined,
        });
      });

    it('should throw UnauthorizedException if userId is missing', async () => {
      await expect(controller.create(undefined as any, { userId: '' } as any)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      const id = 'exp-1';
      const userId = 'user-1';
      expensesService.remove.mockResolvedValue({ id } as any);

      const result = await controller.remove(id, userId);

      expect(result).toEqual({ id });
      expect(expensesService.remove).toHaveBeenCalledWith(id, userId);
    });

    it('should throw UnauthorizedException if userId is missing', async () => {
      await expect(controller.remove('1', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('submit', () => {
    it('should submit an expense', async () => {
      const id = 'exp-1';
      const userId = 'user-1';
      expensesService.submit.mockResolvedValue({ id, status: 'SUBMITTED' } as any);

      const result = await controller.submit(id, userId);

      expect(result).toEqual({ id, status: 'SUBMITTED' });
      expect(expensesService.submit).toHaveBeenCalledWith(id, userId);
    });

    it('should throw UnauthorizedException if userId is missing', async () => {
      await expect(controller.submit('1', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestRevision', () => {
    it('should request revision', async () => {
      const id = 'exp-1';
      const reason = 'Invalid amount';
      expensesService.requestRevision.mockResolvedValue({ id, status: 'REVISION_REQUESTED' } as any);

      const result = await controller.requestRevision(id, reason);

      expect(result).toEqual({ id, status: 'REVISION_REQUESTED' });
      expect(expensesService.requestRevision).toHaveBeenCalledWith(id, reason);
    });

    it('should throw BadRequestException if reason is missing', async () => {
      await expect(controller.requestRevision('1', '')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const id = 'exp-1';
      const body = {
        userId: 'user-1',
        amount: 200,
      };
      expensesService.update.mockResolvedValue({ id, ...body } as any);

      const result = await controller.update(id, body);

      expect(result).toEqual({ id, ...body });
      expect(expensesService.update).toHaveBeenCalledWith(id, body.userId, { amount: 200 });
    });

    it('should throw UnauthorizedException if userId is missing', async () => {
      await expect(controller.update('1', { amount: 200 } as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});

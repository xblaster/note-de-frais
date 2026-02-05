import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

// Mocking the entire @prisma/client module
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      constructor() {}
      $connect = jest.fn().mockResolvedValue(undefined);
    },
  };
});

// Mocking the adapter and pg to avoid any real connection attempts
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call $connect on onModuleInit', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });
});
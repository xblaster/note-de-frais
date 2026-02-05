import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrisma, MockPrismaClient } from '../test/prisma-mock';

describe('AuthController', () => {
  let controller: AuthController;
  let prismaMock: MockPrismaClient;

  beforeEach(async () => {
    prismaMock = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login with valid email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-1',
        email,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await controller.login({ email });

      expect(result.id).toBe('user-1');
      expect(result.email).toBe(email);
      expect(result.role).toBe('EMPLOYEE');
      expect(result.accessToken).toBeDefined();
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should create user on first login if not exists', async () => {
      const email = 'newuser@example.com';
      const mockCreatedUser = {
        id: 'user-2',
        email,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockCreatedUser as any);

      const result = await controller.login({ email });

      expect(result.id).toBe('user-2');
      expect(result.email).toBe(email);
      expect(result.role).toBe('EMPLOYEE');
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email,
          password: 'password',
          role: 'EMPLOYEE',
        },
      });
    });

    it('should return consistent userId across multiple logins', async () => {
      const email = 'consistent@example.com';
      const mockUser = {
        id: 'user-constant-123',
        email,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result1 = await controller.login({ email });
      const result2 = await controller.login({ email });

      expect(result1.id).toBe(result2.id);
      expect(result1.id).toBe('user-constant-123');
    });

    it('should assign EMPLOYEE role to new users', async () => {
      const email = 'newemployee@example.com';
      const mockCreatedUser = {
        id: 'user-3',
        email,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockCreatedUser as any);

      const result = await controller.login({ email });

      expect(result.role).toBe('EMPLOYEE');
    });

    it('should return mock JWT token', async () => {
      const email = 'token@example.com';
      const mockUser = {
        id: 'user-token-123',
        email,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await controller.login({ email });

      expect(result.accessToken).toBe('mock-jwt-token-user-token-123');
    });

    it('should persist user role across logins', async () => {
      const email = 'manager@example.com';
      const mockUser = {
        id: 'user-4',
        email,
        password: 'password',
        role: 'MANAGER',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result1 = await controller.login({ email });
      const result2 = await controller.login({ email });

      expect(result1.role).toBe('MANAGER');
      expect(result2.role).toBe('MANAGER');
    });

    it('should validate email is provided', async () => {
      const mockUser = {
        id: 'user-5',
        email: undefined,
        password: 'password',
        role: 'EMPLOYEE',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      // Note: In a real scenario, this would be handled by NestJS validators
      // This test documents expected behavior
      await expect(controller.login({ email: undefined as any })).rejects.toThrow();
    });
  });
});

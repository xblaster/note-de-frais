import { Test, TestingModule } from '@nestjs/testing';
import { OllamaService } from './ollama.service';
import ollama from 'ollama';
import * as fs from 'fs';

jest.mock('ollama', () => ({
  chat: jest.fn(),
  list: jest.fn(),
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('OllamaService', () => {
  let service: OllamaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OllamaService],
    }).compile();

    service = module.get<OllamaService>(OllamaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeReceipt', () => {
    it('should successfully analyze a receipt', async () => {
      const filePath = 'test.jpg';
      const mockFileContent = Buffer.from('mock image data');
      (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);

      const mockResponse = {
        message: {
          content: JSON.stringify({
            vendor: 'Test Shop',
            amount: 123.45,
            date: '2024-02-05',
          }),
        },
      };
      (ollama.chat as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.analyzeReceipt(filePath);

      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
      expect(ollama.chat).toHaveBeenCalledWith(expect.objectContaining({
        model: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            images: [mockFileContent.toString('base64')],
          }),
        ]),
      }));
      expect(result).toEqual({
        vendor: 'Test Shop',
        amount: 123.45,
        date: '2024-02-05',
      });
    });

    it('should throw error if ollama.chat fails', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('data'));
      (ollama.chat as jest.Mock).mockRejectedValue(new Error('Ollama error'));

      await expect(service.analyzeReceipt('test.jpg')).rejects.toThrow('Ollama error');
    });

    it('should throw error with cause if ollama.chat fails with cause', async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('data'));
        const error = new Error('Ollama error') as any;
        error.cause = { details: 'timeout' };
        (ollama.chat as jest.Mock).mockRejectedValue(error);
  
        await expect(service.analyzeReceipt('test.jpg')).rejects.toThrow('Ollama error');
      });

    it('should throw error if JSON parsing fails', async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('data'));
        (ollama.chat as jest.Mock).mockResolvedValue({
            message: { content: 'invalid json' }
        });
  
        await expect(service.analyzeReceipt('test.jpg')).rejects.toThrow();
      });
  });

  describe('isHealthy', () => {
    it('should return true if ollama.list succeeds', async () => {
      (ollama.list as jest.Mock).mockResolvedValue({});
      const result = await service.isHealthy();
      expect(result).toBe(true);
    });

    it('should return false if ollama.list fails', async () => {
      (ollama.list as jest.Mock).mockRejectedValue(new Error('Down'));
      const result = await service.isHealthy();
      expect(result).toBe(false);
    });
  });
});
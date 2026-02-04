import {
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
  Param,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { OllamaService } from '../ollama/ollama.service';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly ollamaService: OllamaService,
  ) { }

  @Post('analyze')
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Receipt file is required');
    }

    const result = await this.ollamaService.analyzeReceipt(file.path);

    return {
      ...result,
      screenshotUrl: `/uploads/${file.filename}`,
    };
  }

  @Get()
  async findAll(@Query('userId') userId: string | string[]) {
    const uid = Array.isArray(userId) ? userId[0] : userId;
    if (!uid) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.expensesService.findAll(uid);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { amount: string; date: string; vendor?: string; userId: string },
  ) {
    if (!body.userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const screenshotUrl = file ? `/uploads/${file.filename}` : undefined;

    return this.expensesService.create({
      amount: parseFloat(body.amount),
      date: body.date,
      vendor: body.vendor,
      userId: body.userId,
      screenshotUrl,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.expensesService.remove(id, userId);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.expensesService.submit(id, userId);
  }

  @Post(':id/request-revision')
  async requestRevision(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    if (!reason) {
      throw new BadRequestException('Reason is required');
    }
    return this.expensesService.requestRevision(id, reason);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      userId: string;
      amount?: number;
      date?: string;
      vendor?: string;
      description?: string;
      category?: string;
    },
  ) {
    if (!body.userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const { userId, ...updateData } = body;

    return this.expensesService.update(id, userId, updateData);
  }
}

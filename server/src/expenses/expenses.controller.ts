import {
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async findAll(@Query('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.expensesService.findAll(userId);
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
}

import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Get()
    async findAll(@Query('userId') userId: string) {
        if (!userId) {
            throw new UnauthorizedException('User ID is required');
        }
        return this.expensesService.findAll(userId);
    }
}

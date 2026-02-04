import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  imports: [OllamaModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule { }

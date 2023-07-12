import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { TransactionRequestDto } from './dto/TransactionRequestDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction-producer')
  validateTransaction(@Payload() message: TransactionRequestDto): void {
    this.appService.validateTransaction(message);
  }
}

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { KAFKA_REQUEST_TOPIC } from './app/Constants';
import { TransactionRequestDto } from './dto/TransactionRequestDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(KAFKA_REQUEST_TOPIC)
  validateTransaction(@Payload() message: TransactionRequestDto): void {
    Logger.log('MESSAGE RECEIVED ON KAFKA_REQUEST_TOPIC TOPIC');
    this.appService.validateTransaction(message);
  }
}

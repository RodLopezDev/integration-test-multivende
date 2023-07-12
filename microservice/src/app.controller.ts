import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { KAFKA_REQUEST_TOPIC } from './app/Constants';
import { TransactionRequestDto } from './dto/TransactionRequestDto';
import { TransactionResponseDto } from './dto/TransactionResponseDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(KAFKA_REQUEST_TOPIC)
  validateTransaction(@Payload() message: TransactionRequestDto): any {
    const { name } = message;
    console.log(name, 'MESSAGE CONTENT');
    const transactionResponseDto: TransactionResponseDto = {
      value: name.includes('MY_NAME') ? 'OK' : 'ERROR',
    };
    const result = JSON.stringify(transactionResponseDto);
    return result;
  }
}

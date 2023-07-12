import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import {
  KAFKA_CONSUMER_SERVICE,
  KAFKA_PRODUCER_SERVICE,
} from './app/Constants';
import { TransactionRequestDto } from './dto/TransactionRequestDto';
import { TransactionResponseDto } from './dto/TransactionResponseDto';

@Injectable()
export class AppService {
  constructor(
    @Inject(KAFKA_CONSUMER_SERVICE) private readonly kafkaService: ClientKafka,
  ) {}

  validateTransaction(transaction: TransactionRequestDto) {
    const { name } = transaction;
    const transactionResponseDto: TransactionResponseDto = {
      value: name.includes('RODRIGO') ? 'APROBADO' : 'DESAPROBADO',
    };
    const message = JSON.stringify(transactionResponseDto);
    this.kafkaService.emit(KAFKA_PRODUCER_SERVICE, message);
  }
}

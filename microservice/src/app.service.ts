import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_INSTANCE_NAME, KAFKA_RESPONSE_TOPIC } from './app/Constants';
import { TransactionRequestDto } from './dto/TransactionRequestDto';
import { TransactionResponseDto } from './dto/TransactionResponseDto';

@Injectable()
export class AppService {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME) private readonly kafkaService: ClientKafka,
  ) {}

  async validateTransaction(transaction: TransactionRequestDto) {
    try {
      const { name } = transaction;
      console.log(name, 'MESSAGE CONTENT');
      const transactionResponseDto: TransactionResponseDto = {
        value: name.includes('MY_NAME') ? 'OK' : 'ERROR',
      };
      const message = JSON.stringify(transactionResponseDto);
      this.kafkaService.emit(KAFKA_RESPONSE_TOPIC, message);
      Logger.log('MESSAGE SENDED ON KAFKA_REQUEST_TOPIC TOPIC');
    } catch (e) {
      Logger.error(e);
    }
  }
}

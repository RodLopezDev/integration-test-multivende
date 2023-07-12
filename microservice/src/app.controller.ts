import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  KAFKA_INFO_TOPIC,
  KAFKA_BULK_INIT_TOPIC,
  KAFKA_WAREHOUSE_TOPIC,
} from './app/Constants';

import { TransactionRequestDto } from './dto/TransactionRequestDto';
import { TransactionResponseDto } from './dto/TransactionResponseDto';

import { MultivendeService } from './multivende/multivende.service';
import { IntegrationDto } from './dto/IntegrationDto';
import { AxiosError } from 'axios';

@Controller()
export class AppController {
  constructor(private readonly multivendeService: MultivendeService) {}

  @MessagePattern(KAFKA_INFO_TOPIC)
  async infoTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const { clientToken } = message;
    if (!clientToken) {
      return { status: 'ERROR', message: 'TOKEN_NOT_FOUND' };
    }

    try {
      return await this.multivendeService.getInfo(message.clientToken);
    } catch (e) {
      Logger.log(e);
      return { status: 'ERROR', message: e?.message };
    }
  }

  @MessagePattern(KAFKA_WAREHOUSE_TOPIC)
  async warehouseTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const { clientToken } = message;
    if (!clientToken) {
      return { status: 'ERROR', message: 'TOKEN_NOT_FOUND' };
    }

    try {
      const merchant = await this.multivendeService.getInfo(
        message.clientToken,
      );
      return await this.multivendeService.getWarehouse(
        message.clientToken,
        merchant.MerchantId,
      );
    } catch (e) {
      Logger.log(e);
      return { status: 'ERROR', message: e?.message };
    }
  }

  @MessagePattern(KAFKA_BULK_INIT_TOPIC)
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

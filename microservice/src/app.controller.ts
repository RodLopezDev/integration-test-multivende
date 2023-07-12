import {
  BadRequestException,
  Controller,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import {
  KAFKA_INFO_TOPIC,
  KAFKA_BULK_INIT_TOPIC,
  KAFKA_WAREHOUSE_TOPIC,
  KAFKA_BULK_STATUS_TOPIC,
  KAFKA_INTERN_TOPIC_BULK_NODE,
  KAFKA_INSTANCE_NAME,
  OFFSET_BULK_UPDATE,
  TOTAL_BULK_UPDATE,
} from './app/Constants';

import { IntegrationDto } from './dto/IntegrationDto';
import { MultivendeService } from './multivende/multivende.service';
import { BulkService } from './bulk/bulk.service';
import { BulkRunningDto } from './dto/BulkRunningDto';
import { BulkStates } from './app/BulkProcess';

@Controller()
export class AppController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
    private readonly bulkService: BulkService,
    private readonly multivendeService: MultivendeService,
  ) {}

  getToken(message: IntegrationDto): string {
    const { clientToken } = message;
    if (!clientToken) {
      throw new BadRequestException({
        status: 'ERROR',
        message: 'TOKEN_NOT_FOUND',
      });
    }
    return clientToken;
  }

  @MessagePattern(KAFKA_INFO_TOPIC)
  async infoTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const clientToken = this.getToken(message);
    try {
      return await this.multivendeService.getInfo(clientToken);
    } catch (e) {
      Logger.log(e);
      return { status: 'ERROR', message: e?.message };
    }
  }

  @MessagePattern(KAFKA_WAREHOUSE_TOPIC)
  async warehouseTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const clientToken = this.getToken(message);
    try {
      const merchant = await this.multivendeService.getInfo(clientToken);
      return await this.multivendeService.getWarehouse(
        clientToken,
        merchant.MerchantId,
      );
    } catch (e) {
      Logger.log(e);
      return { status: 'ERROR', message: e?.message };
    }
  }

  @MessagePattern(KAFKA_BULK_INIT_TOPIC)
  async bulkTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const clientToken = this.getToken(message);
    const bulk = await this.bulkService.findActive();
    if (bulk) {
      return { state: 'BULK_RUNNING_AGAIN', data: bulk.toJSON() };
    }

    const bulkCreated = await this.bulkService.create('CREATED');

    // TODO: ADD LOGIC BUSSINESS

    const dto: BulkRunningDto = {
      index: 0,
      offset: OFFSET_BULK_UPDATE,
      total: TOTAL_BULK_UPDATE,
      token: clientToken,
    };
    this.client.emit(KAFKA_INTERN_TOPIC_BULK_NODE, dto);
    return { state: 'CREATED', data: bulkCreated.toJSON() };
  }

  @MessagePattern(KAFKA_BULK_STATUS_TOPIC)
  async bulkStateTransaction(): Promise<any> {
    const bulk = await this.bulkService.findActive();
    if (bulk) {
      return { state: 'ACTIVE', data: bulk.toJSON() };
    }
    return { state: 'NOT_FOUND_ACTIVE_BULK', data: null };
  }

  @EventPattern(KAFKA_INTERN_TOPIC_BULK_NODE)
  async bulkRunnerTransaction(@Payload() dto: BulkRunningDto): Promise<any> {
    const { index, offset, total, token } = dto;
    const bulk = await this.bulkService.findActive();
    if (!bulk) {
      return { state: 'NOT_FOUND_ACTIVE_BULK', data: null };
    }

    const isLastIteration = Number(index) + Number(offset) >= Number(total);

    // TODO: ADD LOGIC BUSSINESS
    const data: string[] = new Array(offset).fill('example');

    await this.bulkService.update(
      bulk,
      isLastIteration ? BulkStates.FINISHED : BulkStates.PROCESSING,
      [...bulk.data, ...data],
    );

    if (isLastIteration) {
      return;
    }

    Logger.log(`KAFKA_INTERN_TOPIC_BULK_NODE-index: ${index}`);
    Logger.log(`KAFKA_INTERN_TOPIC_BULK_NODE-offset: ${offset}`);
    Logger.log(`KAFKA_INTERN_TOPIC_BULK_NODE-total: ${total}`);

    const dtoToSend: BulkRunningDto = {
      index: index + offset,
      offset,
      total,
      token,
    };
    this.client.emit(KAFKA_INTERN_TOPIC_BULK_NODE, dtoToSend);
  }
}

import { Inject, Controller, BadRequestException } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import {
  KAFKA_INFO_TOPIC,
  TOTAL_BULK_UPDATE,
  KAFKA_INSTANCE_NAME,
  KAFKA_BULK_INIT_TOPIC,
  KAFKA_WAREHOUSE_TOPIC,
  KAFKA_BULK_STATUS_TOPIC,
  KAFKA_INTERN_TOPIC_BULK_NODE,
  KAFKA_BULK_STATUS_TOPIC_ID,
} from './app/Constants';

import { BulkService } from './bulk/bulk.service';
import { BulkRunningDto } from './dto/BulkRunningDto';
import { IntegrationDto } from './dto/IntegrationDto';
import { MultivendeService } from './multivende/multivende.service';

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
      return { status: 'ERROR', message: e?.message };
    }
  }

  @MessagePattern(KAFKA_BULK_STATUS_TOPIC)
  async bulkStateTransaction(): Promise<any> {
    const bulk = await this.bulkService.findActive();
    if (bulk) {
      return { state: 'ACTIVE', data: bulk.toJSON() };
    }
    return { state: 'NOT_FOUND_ACTIVE_BULK', data: null };
  }

  @MessagePattern(KAFKA_BULK_STATUS_TOPIC_ID)
  async bulkStateTransactionId(@Payload() bulkId: string): Promise<any> {
    const bulk = await this.bulkService.findById(bulkId);
    if (bulk) {
      return { state: 'ACTIVE', data: bulk.toJSON() };
    }
    return { state: 'NOT_FOUND_ACTIVE_BULK', data: null };
  }

  @MessagePattern(KAFKA_BULK_INIT_TOPIC)
  async bulkTransaction(@Payload() message: IntegrationDto): Promise<any> {
    const clientToken = this.getToken(message);
    const bulk = await this.bulkService.findActive();
    if (bulk) {
      return { state: 'BULK_RUNNING_AGAIN', data: bulk.toJSON() };
    }

    const merchant = await this.multivendeService.getInfo(clientToken);
    const warehouse = await this.multivendeService.getWarehouse(
      clientToken,
      merchant.MerchantId,
    );

    if (!warehouse) {
      return { state: 'WAREHOUSE_NOT_FOUND', data: null };
    }

    const bulkCreated = await this.bulkService.create(
      'CREATED',
      warehouse?._id,
      TOTAL_BULK_UPDATE,
    );

    const bulkId = String(bulkCreated.id);

    const dto: BulkRunningDto = {
      bulkId,
      token: clientToken,
    };

    this.client.emit(KAFKA_INTERN_TOPIC_BULK_NODE, dto);

    return { state: 'CREATED', data: bulkCreated.toJSON() };
  }
}

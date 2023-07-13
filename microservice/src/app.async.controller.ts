import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import {
  KAFKA_INSTANCE_NAME,
  KAFKA_INTERN_TOPIC_BULK_AUTH,
  KAFKA_INTERN_TOPIC_BULK_NODE,
  OFFSET_BULK_UPDATE,
} from './app/Constants';

import { BulkStates } from './app/BulkProcess';
import { MultivendeService } from './multivende/multivende.service';

import { BulkService } from './bulk/bulk.service';
import { BulkRunningDto } from './dto/BulkRunningDto';
import { Bulk } from './bulk/entities/bulk.entity';
import { AxiosError } from 'axios';

@Controller()
export class AppAsyncController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
    private readonly bulkService: BulkService,
    private readonly multivendeService: MultivendeService,
  ) {}

  async bulkMultivende(
    bulk: Bulk,
    token: string,
    itemsCount: number,
  ): Promise<[boolean, string]> {
    try {
      const products = new Array(itemsCount).fill({ code: '', amount: 10 });
      await this.multivendeService.bulkUpdate(
        token,
        bulk.warehouseId,
        products,
      );
      return [true, ''];
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response.status === 401) {
          return [false, 'UNAUTHORIZED'];
        }
      }
      return [false, 'ERROR'];
    }
  }

  @EventPattern(KAFKA_INTERN_TOPIC_BULK_NODE)
  async bulkRunnerTransaction(@Payload() dto: BulkRunningDto): Promise<any> {
    Logger.log('MESSAGE_RECEIVED');
    const { bulkId, token } = dto;
    const bulk = await this.bulkService.findById(bulkId);
    if (!bulk) {
      return;
    }
    if ([BulkStates.FINISHED].includes(bulk.state)) {
      return;
    }

    Logger.log('MESSAGE_RECEIVED: index', Number(bulk.current));
    const lastIteration =
      Number(bulk.current) + Number(OFFSET_BULK_UPDATE) > Number(bulk.total);

    // BUSINESS CASE
    const [isCompleted, errorProcess] = await this.bulkMultivende(
      bulk,
      token,
      OFFSET_BULK_UPDATE,
    );
    if (!isCompleted) {
      const retries = (bulk.retries || 0) + 1;
      await this.bulkService.updateError(bulk, true, errorProcess, retries);

      // REVALIDATE TOKEN
      if (errorProcess === 'UNAUTHORIZED') {
        this.client.emit(KAFKA_INTERN_TOPIC_BULK_AUTH, dto);
      }
      return;
    }

    await this.bulkService.update(
      bulk,
      lastIteration ? BulkStates.FINISHED : BulkStates.PROCESSING,
      lastIteration ? bulk.current : bulk.current + OFFSET_BULK_UPDATE,
    );

    Logger.log('BULK_UPDATED');
    if (!lastIteration) {
      this.client.emit(KAFKA_INTERN_TOPIC_BULK_NODE, dto);
    }
  }
}

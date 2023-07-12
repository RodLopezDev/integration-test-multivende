import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import {
  KAFKA_INSTANCE_NAME,
  KAFKA_INTERN_TOPIC_BULK_NODE,
  OFFSET_BULK_UPDATE,
} from './app/Constants';

import { BulkStates } from './app/BulkProcess';
import { MultivendeService } from './multivende/multivende.service';

import { BulkService } from './bulk/bulk.service';
import { BulkRunningDto } from './dto/BulkRunningDto';

@Controller()
export class AppAsyncController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
    private readonly bulkService: BulkService,
    private readonly multivendeService: MultivendeService,
  ) {}

  @EventPattern(KAFKA_INTERN_TOPIC_BULK_NODE)
  async bulkRunnerTransaction(@Payload() dto: BulkRunningDto): Promise<any> {
    const { bulkId, token } = dto;
    const bulk = await this.bulkService.findById(bulkId);
    if (!bulk) {
      return { state: 'NOT_FOUND_ACTIVE_BULK', data: null };
    }
    if (bulk.state !== BulkStates.FINISHED) {
      return { state: 'BULK_FINISHED', data: null };
    }

    const lastIteration =
      Number(bulk.current) + Number(OFFSET_BULK_UPDATE) > Number(bulk.total);

    Logger.log('MESSAGE_RECEIVED');
    Logger.log('MESSAGE_RECEIVED', lastIteration);

    await this.bulkService.update(
      bulkId,
      lastIteration ? BulkStates.FINISHED : BulkStates.PROCESSING,
      bulk.current + OFFSET_BULK_UPDATE,
    );
  }
}

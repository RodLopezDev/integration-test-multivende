import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import {
  KAFKA_INSTANCE_NAME,
  KAFKA_INTERN_TOPIC_BULK_AUTH,
} from './app/Constants';

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

  @EventPattern(KAFKA_INTERN_TOPIC_BULK_AUTH)
  async bulkRunnerTransaction(@Payload() dto: BulkRunningDto): Promise<any> {
    Logger.log('AUTH_EVENT');
  }
}

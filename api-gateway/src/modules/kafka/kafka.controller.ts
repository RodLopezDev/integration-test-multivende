import {
  Get,
  Post,
  Param,
  Inject,
  Logger,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import {
  KAFKA_INSTANCE_NAME,
  KAFKA_INFO_TOPIC,
  KAFKA_WAREHOUSE_TOPIC,
  KAFKA_BULK_INIT_TOPIC,
  KAFKA_BULK_STATUS_TOPIC,
  KAFKA_BULK_STATUS_TOPIC_ID,
} from '../../app/Constants';
import { IntegrationService } from '../integration/integration.service';
import { Integration } from '../integration/entities/integration.entity';
import { ParseMongoIdPipe } from '../common/parse-mongo-id.pipe';

@ApiTags('Kafka')
@Controller()
export class KafkaController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
    private readonly integrationService: IntegrationService,
  ) {}

  async onModuleInit() {
    [
      KAFKA_INFO_TOPIC,
      KAFKA_WAREHOUSE_TOPIC,
      KAFKA_BULK_INIT_TOPIC,
      KAFKA_BULK_STATUS_TOPIC,
      KAFKA_BULK_STATUS_TOPIC_ID,
    ].forEach((topic) => {
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async _getIntegration(): Promise<Integration> {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new InternalServerErrorException('NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration.clientCode) {
      throw new InternalServerErrorException('NOT_INTEGRATED');
    }
    return integration;
  }

  @Post('merchant')
  async kafkaMarchantInfo() {
    const integration = await this._getIntegration();
    return new Observable((observer) => {
      this.client
        .send(KAFKA_INFO_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }

  @Post('warehouse')
  async kafkaWarehouse() {
    const integration = await this._getIntegration();
    return new Observable((observer) => {
      this.client
        .send(KAFKA_WAREHOUSE_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }

  @Get('bulk-init')
  async buklUpdate() {
    const integration = await this._getIntegration();
    return new Observable((observer) => {
      this.client
        .send(KAFKA_BULK_INIT_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }

  @Get('bulk-state')
  async buklState() {
    return new Observable((observer) => {
      this.client.send(KAFKA_BULK_STATUS_TOPIC, {}).subscribe(observer);
    });
  }

  @Get('bulk-state/:bulkId')
  async buklStateById(@Param('bulkId', ParseMongoIdPipe) bulkId: string) {
    return new Observable((observer) => {
      this.client.send(KAFKA_BULK_STATUS_TOPIC_ID, bulkId).subscribe(observer);
    });
  }
}

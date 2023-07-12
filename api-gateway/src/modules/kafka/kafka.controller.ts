import {
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  Post,
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
} from '../../app/Constants';
import { IntegrationService } from '../integration/integration.service';
import { Integration } from '../integration/entities/integration.entity';

@ApiTags('Kafka')
@Controller()
export class KafkaController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
    private readonly integrationService: IntegrationService,
  ) {}

  async onModuleInit() {
    try {
      [
        KAFKA_INFO_TOPIC,
        KAFKA_WAREHOUSE_TOPIC,
        KAFKA_BULK_INIT_TOPIC,
        KAFKA_BULK_STATUS_TOPIC,
      ].forEach((topic) => {
        this.client.subscribeToResponseOf(topic);
      });
      await this.client.connect();
      Logger.log('CONNECTED');
    } catch (e) {
      Logger.error('ERROR');
      Logger.error(e);
    }
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

  @Post('bulk-init')
  async buklUpdate() {
    const integration = await this._getIntegration();
    return new Observable((observer) => {
      this.client
        .send(KAFKA_BULK_INIT_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }

  @Post('bulk-state')
  async buklState() {
    return new Observable((observer) => {
      this.client.send(KAFKA_BULK_STATUS_TOPIC, {}).subscribe(observer);
    });
  }
}

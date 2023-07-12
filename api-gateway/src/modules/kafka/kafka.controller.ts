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
} from 'src/app/Constants';
import { IntegrationService } from '../integration/integration.service';

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
      [KAFKA_INFO_TOPIC, KAFKA_WAREHOUSE_TOPIC].forEach((topic) => {
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

  @Post('merchant')
  async kafkaMarchantInfo() {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new InternalServerErrorException('NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration.clientCode) {
      throw new InternalServerErrorException('NOT_INTEGRATED');
    }

    return new Observable((observer) => {
      this.client
        .send(KAFKA_INFO_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }

  @Post('warehouse')
  async kafkaWarehouse() {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new InternalServerErrorException('NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration.clientCode) {
      throw new InternalServerErrorException('NOT_INTEGRATED');
    }

    return new Observable((observer) => {
      this.client
        .send(KAFKA_WAREHOUSE_TOPIC, integration.toJSON())
        .subscribe(observer);
    });
  }
}

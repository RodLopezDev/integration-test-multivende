import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { KAFKA_REQUEST_TOPIC, KAFKA_INSTANCE_NAME } from 'src/app/Constants';

@Controller()
export class KafkaController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME) private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      this.client.subscribeToResponseOf(KAFKA_REQUEST_TOPIC);
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

  @Get('kafka-test') // EVENT PATTERN
  testKafka() {
    return this.client.emit(KAFKA_REQUEST_TOPIC, { name: 'RODO' });
  }

  @Get('kafka-test-with-response')
  testKafkaWithResponse() {
    return new Observable((observer) => {
      this.client.send(KAFKA_REQUEST_TOPIC, { name: 'MY_NAME' }).subscribe({
        next: (result) => {
          observer.next(result);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });
    });
  }
}

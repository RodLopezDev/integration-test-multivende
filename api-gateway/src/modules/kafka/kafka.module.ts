import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaController } from './kafka.controller';
import {
  KAFKA_INSTANCE_NAME,
  KAFKA_CONSUMER_GROUP_ID,
  KAFKA_CONSUMER_CLIENTID,
} from 'src/app/Constants';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    ConfigModule,
    IntegrationModule,
    ClientsModule.registerAsync([
      {
        name: KAFKA_INSTANCE_NAME,
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>('kafka.host');
          const port = configService.get<string>('kafka.port');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: KAFKA_CONSUMER_CLIENTID,
                brokers: [`${host}:${port}`],
              },
              consumer: {
                groupId: KAFKA_CONSUMER_GROUP_ID,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [KafkaController],
})
export class KafkaModule {}

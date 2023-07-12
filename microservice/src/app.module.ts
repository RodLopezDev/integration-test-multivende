import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Environment';
import {
  KAFKA_CONSUMER_GROUP_ID,
  KAFKA_CONSUMER_SERVICE,
} from './app/Constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
    ClientsModule.register([
      {
        name: KAFKA_CONSUMER_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: KAFKA_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

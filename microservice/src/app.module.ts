import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Environment';
import { KAFKA_CONSUMER_GROUP_ID, KAFKA_INSTANCE_NAME } from './app/Constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

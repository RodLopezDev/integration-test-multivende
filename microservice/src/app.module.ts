import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Environment';

import { BulkModule } from './bulk/bulk.module';
import { AppAsyncController } from './app.async.controller';
import { MultivendeModule } from './multivende/multivende.module';
import { KAFKA_CONSUMER_GROUP_ID, KAFKA_INSTANCE_NAME } from './app/Constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
      }),
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
    MultivendeModule,
    BulkModule,
  ],
  controllers: [AppController, AppAsyncController],
  providers: [],
})
export class AppModule {}

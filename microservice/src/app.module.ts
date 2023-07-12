import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getEnvironmentVars } from './app/Environment';

import { MultivendeModule } from './multivende/multivende.module';
import { KAFKA_CONSUMER_GROUP_ID, KAFKA_INSTANCE_NAME } from './app/Constants';
import { MongooseModule } from '@nestjs/mongoose';
import { BulkModule } from './bulk/bulk.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

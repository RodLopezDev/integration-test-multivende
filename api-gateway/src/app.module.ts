import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { getEnvironmentVars } from './app/Environment';

import { ConfigurationModule } from './modules/configuration/configuration.module';
import { StartModule } from './modules/start/start.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { MultivendeModule } from './modules/multivende/multivende.module';

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
    ConfigurationModule,
    StartModule,
    IntegrationModule,
    MultivendeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

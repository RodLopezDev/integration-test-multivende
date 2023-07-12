import { Module } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  controllers: [ConfigurationController],
  providers: [],
  imports: [IntegrationModule],
})
export class ConfigurationModule {}

import { Module } from '@nestjs/common';
import { StartController } from './start.controller';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  controllers: [StartController],
  providers: [],
  imports: [IntegrationModule],
})
export class StartModule {}

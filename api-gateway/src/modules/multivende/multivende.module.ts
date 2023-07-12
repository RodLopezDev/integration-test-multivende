import { Module } from '@nestjs/common';
import { MultivendeAuthService } from './multivende.auth.service';
import { MultivendeController } from './multivende.controller';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  controllers: [MultivendeController],
  providers: [MultivendeAuthService],
  imports: [IntegrationModule],
})
export class MultivendeModule {}

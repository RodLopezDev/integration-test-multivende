import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { Integration, IntegrationSchema } from './entities/integration.entity';

@Module({
  controllers: [IntegrationController],
  providers: [IntegrationService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      },
    ]),
  ],
  exports: [IntegrationService],
})
export class IntegrationModule {}

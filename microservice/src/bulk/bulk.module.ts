import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BulkService } from './bulk.service';
import { Bulk, BulkSchema } from './entities/bulk.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bulk.name,
        schema: BulkSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [BulkService],
  exports: [BulkService],
})
export class BulkModule {}

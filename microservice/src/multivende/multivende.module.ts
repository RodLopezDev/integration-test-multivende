import { Module } from '@nestjs/common';
import { MultivendeService } from './multivende.service';

@Module({
  providers: [MultivendeService],
  imports: [],
  exports: [MultivendeService],
})
export class MultivendeModule {}

import { Module } from '@nestjs/common';
import { StartController } from './start.controller';

@Module({
  controllers: [StartController],
  providers: [],
})
export class StartModule {}

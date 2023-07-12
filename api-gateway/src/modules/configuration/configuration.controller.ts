import { Request } from 'express';
import { Get, Controller, Req } from '@nestjs/common';

@Controller('configuration')
export class ConfigurationController {
  @Get()
  findAll(@Req() request: Request) {
    const { code } = request.query;
    return [code];
  }
}

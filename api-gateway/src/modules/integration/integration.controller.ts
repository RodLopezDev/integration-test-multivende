import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Integration')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  async create(@Body() createIntegrationDto: CreateIntegrationDto) {
    const data = await this.integrationService.findAll();
    if (!!data?.length) {
      throw new BadRequestException('JUST_ONE_INTEGRATION');
    }
    return this.integrationService.create(createIntegrationDto);
  }

  @Get()
  findAll() {
    return this.integrationService.findAll();
  }

  @Delete('')
  remove() {
    return this.integrationService.remove();
  }
}

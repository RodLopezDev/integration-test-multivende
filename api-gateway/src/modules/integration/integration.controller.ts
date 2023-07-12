import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
      return data[0];
    }
    return this.integrationService.create(createIntegrationDto);
  }

  @Get()
  findAll() {
    return this.integrationService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.integrationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
  //   return this.integrationService.update(+id, updateIntegrationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.integrationService.remove(+id);
  // }
}

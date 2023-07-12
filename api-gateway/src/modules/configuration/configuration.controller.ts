import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Get, Controller, Query } from '@nestjs/common';

import { IntegrationService } from '../integration/integration.service';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly integrationService: IntegrationService,
  ) {}

  @Get()
  async findAll(@Query('code') code: string) {
    const integrations = await this.integrationService.findAll();
    if (!integrations) {
      return false;
    }
    const integration = integrations?.[0];

    const result = await this.integrationService.updateCode(integration, code);

    return result;
  }
}

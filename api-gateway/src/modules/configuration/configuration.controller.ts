import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Get, Controller, Query, Res } from '@nestjs/common';

import { IntegrationService } from '../integration/integration.service';
import { Response } from 'express';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly integrationService: IntegrationService,
  ) {}

  @Get()
  async findAll(@Query('code') code: string, @Res() res: Response) {
    const callbackUrl = this.configService.get<string>('callbackUrl');
    const integrations = await this.integrationService.findAll();
    if (!integrations) {
      return res.redirect(callbackUrl);
    }
    const integration = integrations?.[0];

    await this.integrationService.updateCode(integration, code);

    return res.redirect(callbackUrl);
  }
}

import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Get, Controller, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IntegrationService } from '../integration/integration.service';

@ApiTags('Configuration')
@Controller('start')
export class StartController {
  constructor(
    private readonly configService: ConfigService,
    private readonly integrationService: IntegrationService,
  ) {}

  @ApiOperation({
    summary: 'Redirect to another page',
    description: 'Redirects to the specified URL',
  })
  @ApiResponse({ status: 302, description: 'Redirect response' })
  @Get()
  async redirectToMultivende(@Res() res: Response) {
    const value = this.configService.get<string>('multivende.url');
    const integrations = await this.integrationService.findAll();
    if (!integrations) {
      return res.redirect('');
    }
    const integration = integrations?.[0];

    const payload = {
      response_type: 'code',
      client_id: integration.clientId,
      redirect_uri: `configuration`,
      scope: 'read:checkouts',
    };
    const route = `${value}/apps/authorize?${new URLSearchParams(
      payload,
    ).toString()}`;
    return res.redirect(route);
  }
}

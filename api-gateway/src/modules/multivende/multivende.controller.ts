import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { MultivendeAuthService } from './multivende.auth.service';
import { IntegrationService } from '../integration/integration.service';
import { RetryablePromiseEvent } from './application/RetryblePromise';
import { MultivendeService } from './multivende.service';

@ApiTags('Multivende')
@Controller('multivende')
export class MultivendeController {
  runnable: RetryablePromiseEvent;

  constructor(
    private readonly multivendeAuthService: MultivendeAuthService,
    private readonly multivendeService: MultivendeService,
    private readonly integrationService: IntegrationService,
  ) {
    this.runnable = new RetryablePromiseEvent(this);
  }

  async getToken() {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new NotFoundException('INTEGRATION_NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration?.clientCode.length) {
      throw new BadRequestException('INCOMPLETE_INTEGRATION');
    }
    if (!integration?.clientToken || !integration?.clientToken) {
      throw new BadRequestException('INCOMPLETE_INTEGRATION');
    }
    return integration;
  }

  @Post()
  async token() {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new NotFoundException('INTEGRATION_NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration?.clientCode.length) {
      throw new BadRequestException('INCOMPLETE_INTEGRATION');
    }
    if (!!integration?.clientToken || !!integration?.clientToken) {
      throw new BadRequestException('TOKEN_WAS_GENERATED');
    }

    const result = await this.multivendeAuthService.getToken(integration);
    const updated = await this.integrationService.updateTokens(
      integration,
      result.token,
      result.refreshToken,
    );
    return updated;
  }

  @Post('refresh')
  async refresh() {
    const integrations = await this.integrationService.findAll();
    if (!integrations.length) {
      throw new NotFoundException('INTEGRATION_NOT_FOUND');
    }
    const integration = integrations?.[0];
    if (!integration?.clientCode.length) {
      throw new BadRequestException('INCOMPLETE_INTEGRATION');
    }
    if (!integration?.clientToken || !integration?.clientToken) {
      throw new BadRequestException('INCOMPLETE_INTEGRATION');
    }

    const result = await this.multivendeAuthService.refresh(integration);
    const updated = await this.integrationService.updateTokens(
      integration,
      result.token,
      result.refreshToken,
    );
    return updated;
  }

  @Post('info')
  async getInfo() {
    const result = await this.runnable.run<string>((token) => {
      return this.multivendeService.getInfo(token);
    });
    return result;
  }
}

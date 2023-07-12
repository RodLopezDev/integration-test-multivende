import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Integration } from '../integration/entities/integration.entity';
import { TokenResponse } from './entities/token.entity';
import { MapToken as MapTokenResponse } from './mappers/token.mapper';

@Injectable()
export class MultivendeAuthService {
  constructor(private readonly configService: ConfigService) {}

  async getToken(integration: Integration) {
    const baseUrl = this.configService.get<string>('multivende.url');
    try {
      const { data } = await axios.post(
        `${baseUrl}/oauth/access-token`,
        {
          client_id: integration.clientId,
          client_secret: integration.clientSecret,
          grant_type: 'authorization_code',
          code: integration.clientCode,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return MapTokenResponse(data);
    } catch (e) {
      throw new Error('REQUEST_ERROR');
    }
  }

  async refresh(integration: Integration): Promise<TokenResponse> {
    const baseUrl = this.configService.get<string>('multivende.url');
    try {
      const payload = {
        client_id: integration.clientId,
        client_secret: integration.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: integration.clientRefreshToken,
      };
      const { data } = await axios.post(
        `${baseUrl}/oauth/access-token`,
        payload,
      );
      return MapTokenResponse(data);
    } catch (e) {
      throw new Error('REQUEST_ERROR');
    }
  }
}

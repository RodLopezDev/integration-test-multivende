import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MultivendeService {
  constructor(private readonly configService: ConfigService) {}

  async getInfo(token: string) {
    const baseUrl = this.configService.get<string>('multivende.url');
    try {
      const { data } = await axios.get(`${baseUrl}/api/d/info`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      return data;
    } catch (e) {
      throw new Error('REQUEST_ERROR');
    }
  }
}

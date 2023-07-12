import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MultivendeService {
  constructor(private readonly configService: ConfigService) {}

  async getInfo(token: string) {
    const baseUrl = this.configService.get<string>('multivende.url');
    const { data } = await axios.get(`${baseUrl}/api/d/info`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return data;
  }

  async getWarehouse(token: string, merchantId: string, page = 1) {
    const baseUrl = this.configService.get<string>('multivende.url');
    const { data } = await axios.get(
      `${baseUrl}/api/m/${merchantId}/stores-and-warehouses/p/${page}`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    return data;
  }

  async getPrices(token: string, merchantId: string, page = 1) {
    const baseUrl = this.configService.get<string>('multivende.url');
    const { data } = await axios.get(
      `${baseUrl}/api/m/${merchantId}/product-price-lists/p/${page}`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    return data;
  }
}

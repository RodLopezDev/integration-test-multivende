import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MultivendeService {
  constructor(private readonly configService: ConfigService) {}

  async getInfo(token: string) {
    const baseUrl = this.configService.get<string>('multivende.url');
    const url = `${baseUrl}/api/d/info`;
    const headers = {
      Authorization: `bearer ${token}`,
    };
    console.log(url);
    console.log(headers);
    const { data } = await axios.get(`${baseUrl}/api/d/info`, {
      headers,
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
    if (!data?.entries?.[0]) {
      return null;
    }
    return data?.entries?.[0];
  }

  async bulkUpdate(token: string, warehouseId: string, products: any[]) {
    const baseUrl = this.configService.get<string>('multivende.url');
    const { data } = await axios.post(
      `${baseUrl}/api/product-stocks/stores-and-warehouses/${warehouseId}/bulk-set`,
      products,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Integration } from './entities/integration.entity';
import { Model } from 'mongoose';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<Integration>,
  ) {}

  async create(dto: CreateIntegrationDto) {
    return await this.integrationModel.create({
      ...dto,
      clientCode: '',
      clientToken: '',
      clientRefreshToken: '',
    });
  }

  async findAll() {
    return await this.integrationModel.find({});
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} integration`;
  // }

  // update(id: number, updateIntegrationDto: UpdateIntegrationDto) {
  //   return `This action updates a #${id} integration`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} integration`;
  // }
}

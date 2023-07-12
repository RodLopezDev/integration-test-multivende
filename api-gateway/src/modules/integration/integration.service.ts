import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findById(id: string) {
    const integration = await this.integrationModel.findById(id);
    if (!integration) {
      return null;
    }
    throw new NotFoundException(`Not found integration`);
  }

  async updateCode(dto: Integration, clientCode: string) {
    const integration = await this.findById(dto.id);
    try {
      const newIntegration = await integration.updateOne(
        { ...dto.toJSON(), clientCode },
        {
          new: true,
        },
      );
      if (!!newIntegration.matchedCount) {
        return dto.toJSON();
      }
      return null;
    } catch (e) {
      throw new InternalServerErrorException(e?.message);
    }
  }

  async updateTokens(dto: Integration, token: string, refreshToken: string) {
    const integration = await this.findById(dto.id);
    try {
      const newIntegration = await integration.updateOne(
        { ...dto.toJSON(), token, refreshToken },
        {
          new: true,
        },
      );
      if (!!newIntegration.matchedCount) {
        return dto.toJSON();
      }
      return null;
    } catch (e) {
      throw new InternalServerErrorException(e?.message);
    }
  }

  async remove() {
    const result = await this.integrationModel.deleteMany({});
    return result.deletedCount > 0;
  }
}

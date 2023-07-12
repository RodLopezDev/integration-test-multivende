import { Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Bulk } from './entities/bulk.entity';

@Injectable()
export class BulkService {
  constructor(
    @InjectModel(Bulk.name)
    private readonly bulkModel: Model<Bulk>,
  ) {}

  async create(state: string) {
    return await this.bulkModel.create({ state, data: [] });
  }

  async findAll() {
    return await this.bulkModel.find({});
  }

  async findById(id: string) {
    const bulk = await this.bulkModel.findById(id);
    if (!!bulk) {
      return bulk;
    }
    throw new NotFoundException(`Not found integration`);
  }

  async update(dto: Bulk, state: string, data: string[]) {
    const integration = await this.findById(dto.id);
    try {
      const newIntegration = await integration.updateOne(
        { ...dto.toJSON(), state, data },
        {
          new: true,
        },
      );
      if (!!newIntegration.matchedCount) {
        return { ...dto.toJSON(), state, data };
      }
      throw new InternalServerErrorException('NOT_UPDATED');
    } catch (e) {
      throw new InternalServerErrorException(e?.message);
    }
  }

  async remove() {
    const result = await this.bulkModel.deleteMany({});
    return result.deletedCount > 0;
  }
}

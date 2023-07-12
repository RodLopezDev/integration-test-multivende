import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Bulk } from './entities/bulk.entity';
import { BulkStates } from '../app/BulkProcess';

@Injectable()
export class BulkService {
  constructor(
    @InjectModel(Bulk.name)
    private readonly bulkModel: Model<Bulk>,
  ) {}

  async create(state: string, warehouseId: string, total: number) {
    const createdAt = new Date();
    return await this.bulkModel.create({
      state,
      warehouseId,
      current: 0,
      total,
      retries: 0,
      hasError: false,
      errorType: '',
      createdAt,
      updatedAt: createdAt,
    });
  }

  async findAll() {
    return await this.bulkModel.find({});
  }

  async findActive(): Promise<Bulk | null> {
    const bulks = await this.bulkModel.find({
      $or: [
        { state: BulkStates.CREATED },
        { state: BulkStates.PROCESSING },
        { state: BulkStates.RETRYING },
      ],
    });
    if (!bulks.length) {
      return null;
    }
    return bulks?.[0];
  }

  async findById(id: string) {
    const bulk = await this.bulkModel.findById(id);
    if (!!bulk) {
      return bulk;
    }
    return null;
  }

  async update(bulkId: string, state: string, current: number) {
    const integration = await this.findById(bulkId);
    if (!integration) {
      return null;
    }

    try {
      const hasError = false;
      const updatedAt = new Date();
      const newIntegration = await integration.updateOne(
        { state, current, updatedAt, hasError },
        {
          new: true,
        },
      );
      if (!!newIntegration.matchedCount) {
        return { ...integration.toJSON(), state, current, updatedAt, hasError };
      }
      throw new InternalServerErrorException('NOT_UPDATED');
    } catch (e) {
      throw new InternalServerErrorException(e?.message);
    }
  }

  async updateError(
    bulkId: string,
    hasError: boolean,
    errorType: string,
    retries: number,
  ) {
    const integration = await this.findById(bulkId);
    try {
      const updatedAt = new Date();
      const newIntegration = await integration.updateOne(
        { ...integration.toJSON(), hasError, errorType, retries, updatedAt },
        {
          new: true,
        },
      );
      if (!!newIntegration.matchedCount) {
        return {
          ...integration.toJSON(),
          hasError,
          errorType,
          retries,
          updatedAt,
        };
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

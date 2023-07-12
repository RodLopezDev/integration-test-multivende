import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Bulk extends Document {
  @Prop()
  state: string;

  @Prop()
  warehouseId: string;

  @Prop()
  current: number;

  @Prop()
  total: number;

  @Prop()
  hasError: boolean;

  @Prop()
  errorType: string;

  @Prop()
  retries: number;

  @Prop()
  createAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BulkSchema = SchemaFactory.createForClass(Bulk);

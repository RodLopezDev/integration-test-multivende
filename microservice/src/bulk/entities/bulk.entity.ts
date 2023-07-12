import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Bulk extends Document {
  @Prop()
  state: string;

  @Prop()
  data: string[];
}

export const BulkSchema = SchemaFactory.createForClass(Bulk);

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Integration extends Document {
  @Prop()
  name: string;

  @Prop()
  clientId: string;

  @Prop()
  clientSecret: string;

  @Prop()
  clientCode: string;

  @Prop()
  clientToken: string;

  @Prop()
  clientRefreshToken: string;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);

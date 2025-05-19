import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RewardDocument extends Document {
  @Prop({ required: true, index: true })
  eid: string;

  @Prop({ required: true })
  items: string[];

  @Prop({ required: true })
  amount: number[];

  @Prop({ required: true })
  condition: string[];
}

export const RewardSchema = SchemaFactory.createForClass(RewardDocument);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class ClaimDocument extends Document {
  @Prop({ required: true })
  uid: string;
  @Prop({ required: true })
  rid: string;
  @Prop({ required: true })
  eid: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true, default: Date.now })
  awardedAt: Date;
}

export const ClaimSchema = SchemaFactory.createForClass(ClaimDocument);
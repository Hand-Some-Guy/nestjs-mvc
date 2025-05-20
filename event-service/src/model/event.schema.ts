import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventState } from '../event/dto/event.dto';

@Schema({ timestamps: true })
export class EventDocument extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: false })
  rid: string;

  @Prop({ required: true, index: true })
  dateAdded: Date;

  @Prop({ required: true, index: true })
  dateStart: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  state: EventState;

  @Prop({ required: true, type: [String], default: [] })
  condition: string[];

  @Prop({ required: true, type: [Number], default: [] })
  conditionNum: number[];

  @Prop({ required: true, type: [String], default: [] })
  conditionType: string[];
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
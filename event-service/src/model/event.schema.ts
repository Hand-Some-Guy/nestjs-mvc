import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventState } from 'src/event/dto/event.dto';

@Schema()
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
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class EventDocument extends Document {

    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    eid: string;

    @Prop({ required: true })
    dateAdded: Date;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    duration: number;

}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
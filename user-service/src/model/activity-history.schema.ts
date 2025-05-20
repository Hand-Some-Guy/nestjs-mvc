import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { activaeType } from 'src/auth/dto/user.dto';

@Schema()
export class ActivityHistoryDocument extends Document {

    @Prop({ required: true })
    uid: string

    @Prop({ required: true })   
    type: activaeType

    @Prop({ required: true, type: Date, index: true })
    date: Date; 

    @Prop({ required: true })
    time: string; 

}

export const ActivityHistorySchema = SchemaFactory.createForClass(ActivityHistoryDocument);
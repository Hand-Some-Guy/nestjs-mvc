import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class ClaimDocument extends Document {

    @Prop({ required: true, unique: true })
    uid: string;

    @Prop({ required: true })
    eid: string;

    @Prop({ required: true })
    state: string;
}

export const ClaimSchema = SchemaFactory.createForClass(ClaimDocument);
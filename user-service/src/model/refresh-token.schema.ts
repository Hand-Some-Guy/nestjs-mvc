import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RefreshTokenDocument extends Document {

    @Prop({ required: true })
    uid: string

    @Prop({ required: true })   
    token: string

}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenDocument);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// TODO : default 유저 변경 필요 
// 
@Schema()
export class UserDocument extends Document {

    @Prop({ required: true, unique: true })
    uid: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'user' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
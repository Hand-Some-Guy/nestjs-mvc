import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { RefreshToken } from "src/model/refresh-token.aggregate";
import { RefreshTokenDocument } from '../model/refresh-token.schema';
import { RefreshTokenMapper } from './mapper/refresh-token.mapper';

interface RefreshTokenRepository {
    create(uid: string, token: string): Promise<RefreshToken>;

    getAll(): Promise<RefreshToken[]>;

    findById(uid: string): Promise<RefreshToken>;
    
    update(target: RefreshToken): Promise<void>;

    delete(uid: string): Promise<void>;
}

@Injectable()
export class RefreshTokenMongoose implements RefreshTokenRepository {

    constructor(
        @InjectModel(RefreshTokenDocument.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    ) {}

    async create(uid: string, token: string): Promise<RefreshToken>{
        const refreshTokenDoc = new this.refreshTokenModel({ uid: uid, token: token });
        const savetoken = await refreshTokenDoc.save()
        const t = RefreshTokenMapper.toDomain(savetoken)

        return t
    }

    async getAll(): Promise<RefreshToken[]> {
        const tokenDocs = await this.refreshTokenModel.find().exec();
        return tokenDocs.map(RefreshTokenMapper.toDomain)
    }

    async findById(uid: string): Promise<RefreshToken> {
        const tokenDoc = await this.refreshTokenModel.findOne({ uid: uid }).exec();
        return tokenDoc ? RefreshTokenMapper.toDomain(tokenDoc) : null;
    }

    async update(target: RefreshToken): Promise<void> {
        await this.refreshTokenModel.updateOne({ uid: target.getId() }, { token: target.getToken() }).exec();
    }
    
    async delete(uid: string): Promise<void> {
        await this.refreshTokenModel.deleteMany({ uid: uid }).exec();
    }
}
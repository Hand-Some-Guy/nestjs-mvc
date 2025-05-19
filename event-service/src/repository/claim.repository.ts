import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim } from '../model/claim.aggregate';
import { ClaimDocument } from '../model/claim.schema';
import { ClaimMapper } from './mapper/claim.mapper';

interface ClaimRepository {
  create(uid: string, rid: string, eid: string, state: string): Promise<Claim>;
  findByUserAndEvent(uid: string, eid: string): Promise<Claim | null>;
  findByUser(uid: string): Promise<Claim[]>;
  update(cid: string, state: string): Promise<void>;
  delete(cid: string): Promise<void>;
}

@Injectable()
export class ClaimMongoose implements ClaimRepository {
  constructor(
    @InjectModel(ClaimDocument.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async create(uid: string, rid: string, eid: string, state: string): Promise<Claim> {
    const claimDoc = new this.claimModel({ uid, rid, eid, state });
    const savedClaim = await claimDoc.save();
    return ClaimMapper.toDomain(savedClaim);
  }

  async findByUserAndEvent(uid: string, eid: string): Promise<Claim | null> {
    const claimDoc = await this.claimModel.findOne({ uid, eid }).exec();
    return ClaimMapper.toDomain(claimDoc);
  }

  // 필터링을 위한 메서드 
  async findByEvent(eid: string): Promise<Claim[] | null>{
    const claimDocs = await this.claimModel.find({ eid: eid }).exec();
    return claimDocs.map(ClaimMapper.toDomain);
  }

  async findByUser(uid: string): Promise<Claim[]> {
    const claimDocs = await this.claimModel.find({ uid }).exec();
    return claimDocs.map(ClaimMapper.toDomain);
  }

  async update(cid: string, state: string): Promise<void> {
    await this.claimModel.updateOne({ _id: cid }, { state }).exec();
  }

  async delete(cid: string): Promise<void> {
    await this.claimModel.deleteOne({ _id: cid }).exec();
  }
}
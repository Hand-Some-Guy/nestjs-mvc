import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from "src/model/user.aggregate";
import { UserDocument  } from '../model/user.schema';

import { UserMapper } from './mapper/user.mapper';

interface UserRepository {
  create(id: string, password: string, role?: string): Promise<User>;
  getAll(): Promise<User[]>;
  findById(userId: string): Promise<User | null>;
  updateRole(id: string, role: string): Promise<void>;
  delete(userId: string): Promise<void>;
}

@Injectable()
export class UserMongoose implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
  ) {}

  async create(uid: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = new this.userModel({ uid: uid, password: hashedPassword, role: role });
    const savedDoc = await userDoc.save();
    return UserMapper.toDomain(savedDoc);
  }

  async getAll(): Promise<User[]> {
    const userDocs = await this.userModel.find().exec();
    return userDocs.map(UserMapper.toDomain);
  }

  async findById(uid: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ uid: uid }).exec();
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async updateRole(uid: string, role: string): Promise<void> {
    await this.userModel.updateOne({ uid: uid }, { role }).exec();
  }

  async delete(uid: string): Promise<void> {
    await this.userModel.deleteOne({ uid: uid }).exec();
  }
}
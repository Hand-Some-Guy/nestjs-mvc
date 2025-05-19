import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { Event } from "src/model/event.aggregate";
import { EventDocument } from '../model/event.schema';
import { EventMapper } from './mapper/event.mapper';

interface EventRepository {
    create( 
        eid: string, 
        rid: string, 
        title: string,  
        dateAdded: Date, 
        dateStart: Date, 
        duration: number
    ): Promise<Event>;

    getAll(): Promise<Event[]>;

    findById(eid: string): Promise<Event>;
    
    update(eid: string): Promise<void>;

    delete(eid: string): Promise<void>;
}

@Injectable()
export class EventMongoose implements EventRepository{

    constructor(
        @InjectModel(EventDocument.name) private eventModel: Model<EventDocument>,
    ){}
    

    async create(
        eid: string, 
        rid: string, 
        title: string,  
        dateAdded: Date, 
        dateStart: Date, 
        duration: number
    ): Promise<Event>{
        const eventDoc = new this.eventModel({ 
                eid: eid ,
                rid: rid,
                title: title,
                dateAdded: dateAdded,
                dateStart: dateStart,
                duration: duration
            });
        const saveEvent = await eventDoc.save()

        return EventMapper.toDomain(saveEvent)
    }
    
    async getAll(): Promise<Event[]> {
        const events = await this.eventModel.find().exec()
        return events.map(EventMapper.toDomain)
    }

    async findById(eid: string): Promise<Event | null> {
        const event = await this.eventModel.findOne({ _id: eid}).exec()
        return event ? EventMapper.toDomain(event) : null
    }


    // 추가 작업 필요 
    update(eid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(eid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    

}
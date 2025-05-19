import { Event } from '../../model/event.aggregate';
import { EventDocument } from '../../model/event.schema';

export class EventMapper {
    static toDomain(doc: EventDocument): Event {
        return new Event(
            doc._id.toString(), 
            doc.rid, 
            doc.title,  
            doc.dateAdded, 
            doc.dateStart, 
            doc.duration,
            doc.state
        );
    }
}
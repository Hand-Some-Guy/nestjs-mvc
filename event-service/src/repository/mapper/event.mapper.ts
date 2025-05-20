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
      doc.state,
      doc.condition,
      doc.conditionNum,
      doc.conditionType,
    );
  }

  static toPersistence(aggregate: Partial<Event>): Partial<EventDocument> {
    return {
      title: aggregate.getTitle?.(),
      rid: aggregate.getRid?.(),
      dateAdded: aggregate.getDateAdded?.(),
      dateStart: aggregate.getDateStart?.(),
      duration: aggregate.getDuration?.(),
      state: aggregate.getState?.(),
      condition: aggregate.getCondition?.(),
      conditionNum: aggregate.getConditionNum?.(),
      conditionType: aggregate.getConditionType?.(),
    };
  }
}
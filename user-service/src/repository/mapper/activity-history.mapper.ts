import { ActivityHistory } from 'src/model/activity-history.aggregate';
import { ActivityHistoryDocument } from 'src/model/activity-history.schema';

export class ActivityHistoryMapper {
  static toDomain(doc: ActivityHistoryDocument): ActivityHistory {
    return new ActivityHistory(doc.uid, doc.type, doc.date, doc.time);
  }

  static toPersistence(aggregate: ActivityHistory): Partial<ActivityHistoryDocument> {
    return {
      uid: aggregate.getUid(),
      type: aggregate.getType(),
      date: aggregate.getDate(),
      time: aggregate.getTime(),
    };
  }
}
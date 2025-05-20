import { Reward } from '../../model/reward.aggregate';
import { RewardDocument } from '../../model/reward.schema';

export class RewardMapper {
  static toDomain(doc: RewardDocument): Reward {
    return new Reward(doc._id.toString(), doc.eid, doc.items, doc.amount);
  }

  static toPersistence(aggregate: Reward): Partial<RewardDocument> {
    return {
      eid: aggregate.getEid(),
      items: aggregate.getItems(),
      amount: aggregate.getAmount(),
    };
  }
}
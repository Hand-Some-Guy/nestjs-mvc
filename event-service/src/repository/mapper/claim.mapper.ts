import { Claim } from '../../model/claim.aggregate';
import { ClaimDocument } from '../../model/claim.schema';

export class ClaimMapper {
  static toDomain(doc: ClaimDocument): Claim {
    return new Claim(
      doc._id.toString(),
      doc.uid,
      doc.rid,
      doc.eid,
      doc.state,
      doc.awardedAt,
    );
  }
}
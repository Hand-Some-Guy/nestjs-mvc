import { RefreshToken } from '../../model/refresh-token.aggregate';
import { RefreshTokenDocument } from '../../model/refresh-token.schema';

export class RefreshTokenMapper {
    static toDomain(doc: RefreshTokenDocument): RefreshToken {
        return new RefreshToken(doc.uid, doc.token);
    }

    static toPersistence(aggregate: RefreshToken): Partial<RefreshTokenDocument> {
        return {
            token: aggregate.getToken(),
        };
    }
}
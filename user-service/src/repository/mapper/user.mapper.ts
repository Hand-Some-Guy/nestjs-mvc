import { User } from '../../model/user.aggregate';
import { UserDocument } from '../../model/user.schema';

export class UserMapper {
    static toDomain(doc: UserDocument): User {
        return new User(doc.uid, doc.password, doc.role);
    }

    static toPersistence(aggregate: User): Partial<UserDocument> {
        return {
            password: aggregate.getPassword(),
            role: aggregate.getRole(),
        };
    }
}
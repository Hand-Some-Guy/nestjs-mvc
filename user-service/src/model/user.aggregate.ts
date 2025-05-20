import { Role } from "src/auth/dto/user.dto";

// 엔티티 객체 
export class User{
    private uid: string;
    private password: string;
    private role: Role;

    constructor(uid: string, password: string, role: Role) {
        this.uid = uid;
        this.password = password;
        this.role = role;
    }

    getId(): string {
        return this.uid;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.role;
    }
}
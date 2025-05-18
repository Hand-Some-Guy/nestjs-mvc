
// 엔티티 객체 
export class User{
    private uid: string;
    private password: string;
    private role: string;

    constructor(uid: string, password: string, role: string) {
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

    getRole(): string {
        return this.role;
    }
}
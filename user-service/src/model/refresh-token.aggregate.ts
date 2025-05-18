// 밸류 엔티티 
export class RefreshToken {
    private uid: string;
    private token: string;

    constructor(uid: string, token: string){
        this.uid = uid
        this.token = token
    }

    getId(): string {
        return this.uid;
    }

    getToken(): string {
        return this.token;
    }

}
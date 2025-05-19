
// 엔티티 객체 
export class User{
    private rid: string;
    private eid: string;
    private items: string[];
    private conditon: string[];
    private amount: number[];

    constructor(rid: string, eid: string, items: string[], amount: number[], conditon: string[]) {
        this.rid = rid;
        this.eid = eid;
        this.items = items;
        this.amount = amount;
        this.conditon = conditon;
    }

}
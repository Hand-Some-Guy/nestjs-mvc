
// 엔티티 객체 
export class Event{
    private cid: string;
    private uid: string;
    private rid: string;
    private eid: string;
    private state: string;
    private awardedAt: Date

    constructor(cid: string, uid: string, rid: string, eid: string ,  state: string, awardedAt: Date) {
        this.cid = cid;
        this.eid = eid;
        this.uid = uid;
        this.state = state
        this.awardedAt =  awardedAt
    }

}
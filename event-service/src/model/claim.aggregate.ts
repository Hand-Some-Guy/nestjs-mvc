
// 엔티티 객체 
export class Event{
    private cid: string;
    private eid: string;
    private uid: string;
    private state: string;

    constructor(cid: string, eid: string, uid: string, state: string) {
        this.cid = cid;
        this.eid = eid;
        this.uid = uid;
        this.state = state
    }

}
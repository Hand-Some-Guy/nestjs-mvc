
// 엔티티 객체 
export class Event{
    private eid: string;
    private rid: string;
    private title: string;
    private dateAdded: Date;
    private dateStart: Date;
    private duration: number;
    

    constructor(
        eid: string, rid: string, title: string,  dateAdded: Date, dateStart: Date, duration: number
    ) {
        this.eid = eid;
        this.rid = rid;
        this.title = title;
        this.dateAdded = dateAdded;
        this.dateStart = dateStart;
        this.duration = duration;
    }

}
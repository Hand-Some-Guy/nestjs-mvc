import { activaeType } from "src/auth/dto/user.dto";

// 밸류 엔티티 
export class ActivityHistory {
    private uid: string;
    private type: activaeType
    private date: Date;
    private time: string;

    constructor(uid: string, type: activaeType, date: Date, time: string) {
        this.validate(uid, type, date, time);
        this.uid = uid;
        this.type = type;
        this.date = date;
        this.time = time;
    }

    private validate(uid: string, type: string, date: Date, time: string): void {
        if (!uid || !type) {
        throw new Error('User ID and type are required');
        }
        if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
        }
        if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        throw new Error('Invalid time format (expected HH:mm:ss)');
        }
    }

    getUid(): string {
        return this.uid;
    }

    getType(): activaeType{
        return this.type;
    }

    getDate(): Date {
        return this.date;
    }

    getTime(): string {
        return this.time;
    }

}
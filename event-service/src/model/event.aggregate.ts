import { EventState } from "src/event/dto/event.dto";

export class Event {
  private eid: string;
  private rid: string | null;
  private title: string;
  private dateAdded: Date;
  private dateStart: Date;
  private duration: number;
  private state: EventState;

  constructor(
    eid: string,
    rid: string | null,
    title: string,
    dateAdded: Date,
    dateStart: Date,
    duration: number,
    state: EventState,
  ) {
    this.validate(title, dateAdded, dateStart, duration);
    this.eid = eid;
    this.rid = rid;
    this.title = title;
    this.dateAdded = dateAdded;
    this.dateStart = dateStart;
    this.duration = duration;
    this.state = state
  }

  private validate(title: string, dateAdded: Date, dateStart: Date, duration: number): void {
    if (!title) {
      throw new Error('Title is required');
    }
    if (isNaN(dateAdded.getTime()) || isNaN(dateStart.getTime())) {
      throw new Error('Invalid date format');
    }
    if (dateStart < dateAdded) {
      throw new Error('Start date must be after added date');
    }
    if (duration <= 0) {
      throw new Error('Duration must be positive');
    }
  }

  public getEid(): string {
    return this.eid;
  }

  public getRid(): string | null {
    return this.rid;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDateAdded(): Date {
    return this.dateAdded;
  }

  public getDateStart(): Date {
    return this.dateStart;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getState(): EventState {
    return this.state;
  }
}
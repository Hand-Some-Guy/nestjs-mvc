import { EventState } from '../event/dto/event.dto';

export class Event {
  private eid: string;
  private rid: string | null;
  private title: string;
  private dateAdded: Date;
  private dateStart: Date;
  private duration: number;
  private state: EventState;
  private condition: string[];
  private conditionNum: number[];
  private conditionType: string[];

  constructor(
    eid: string,
    rid: string | null,
    title: string,
    dateAdded: Date,
    dateStart: Date,
    duration: number,
    state: EventState,
    condition: string[],
    conditionNum: number[],
    conditionType: string[],
  ) {
    this.validate(title, dateAdded, dateStart, duration, condition, conditionNum, conditionType);
    this.eid = eid;
    this.rid = rid;
    this.title = title;
    this.dateAdded = dateAdded;
    this.dateStart = dateStart;
    this.duration = duration;
    this.state = state;
    this.condition = condition;
    this.conditionNum = conditionNum;
    this.conditionType = conditionType;
  }

  private validate(
    title: string,
    dateAdded: Date,
    dateStart: Date,
    duration: number,
    condition: string[],
    conditionNum: number[],
    conditionType: string[],
  ): void {
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
    if (condition.length !== conditionNum.length || condition.length !== conditionType.length) {
      throw new Error('Condition arrays must have equal length');
    }
    if (conditionNum.some(num => num < 0)) {
      throw new Error('Condition numbers must be non-negative');
    }
    if (conditionType.some(type => !type)) {
      throw new Error('Condition types must be non-empty');
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

  public getCondition(): string[] {
    return this.condition;
  }

  public getConditionNum(): number[] {
    return this.conditionNum;
  }

  public getConditionType(): string[] {
    return this.conditionType;
  }
}
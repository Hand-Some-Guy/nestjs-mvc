
export type EventState = "Active" | "Disable"

export class EventAddDto {
  title: string;

  rid?: string;

  dateAdded: string;

  dateStart: string;

  duration: number;

  state: EventState
}

export class EventSearchDto {
  eid: string;
}

export class RewardAddDto {
  eid: string;

  items: string[];

  amount: number[];

  condition: string[];
}

export class RewardSearchDto {
  rid: string;
}

export interface EventResponse {
  eid: string;
  title: string;
  rid?: string;
  dateAdded: string;
  dateStart: string;
  duration: number;
}

export interface RewardResponse {
  rid: string;
  eid: string;
  items: string[];
  amount: number[];
  condition: string[];
}

export interface ClaimResponse {
  cid: string;
  uid: string;
  rid: string;
  eid: string;
  state: string;
  awardedAt: string;
}
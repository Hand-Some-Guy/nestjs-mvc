export enum EventState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}


export class EventAddDto {
  title: string;

  rid?: string;

  dateAdded: string;

  dateStart: string;

  duration: number;

  state: EventState;

  condition: string[];

  conditionNum: number[];

  conditionType: string[];
}

export class EventSearchDto {
  eid?: string;
}

export class RewardAddDto {
  eid: string;

  items: string[];

  amount: number[];
}

export class RewardSearchDto {
  rid: string;
}

export class RewardRequestDto {
  uid: string;

  rid: string;

  eid: string;
}

export class ClaimSearchDto {
  id: string;

  filterType: 'uid' | 'eid' | 'rid';
}

export interface EventResponse {
  eid: string;
  title: string;
  rid?: string;
  dateAdded: string;
  dateStart: string;
  duration: number;
  condition: string[];
  conditionNum: number[];
  conditionType: string[];
}

export interface RewardResponse {
  rid: string;
  eid: string;
  items: string[];
  amount: number[];
}

export interface ClaimResponse {
  cid: string;
  uid: string;
  rid: string;
  eid: string;
  state: string;
  awardedAt: string;
}
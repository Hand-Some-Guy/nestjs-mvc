
export class EventAddDto {
  title: string;

  rid?: string;

  dateAdded: string;

  dateStart: string;

  duration: number;
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
export type Role = "USER" | "OPERATOR" | "AUDITOR" | "ADMIN"


export class LoginDto {
  id: string;

  password: string;
}

export class RefreshDto {
  refreshToken: string;
}

export class RegisterDto {
  id: string;

  password: string;
}

export class UpdateRoleDto {
  id: string;

  role: string;
}

export class EventAddDto {
  title: string;

  rid?: string;

  dateAdded: string;

  dateStart: string;

  duration: number;

  state: string;
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

export class RewardRequestDto {
  uid: string;

  rid: string;

  eid: string;
}

export class RewardHistoryDto {
  uid: string;
}

export class ClaimSearchDto {
  id: string;

  filterType: 'uid' | 'eid' | 'rid';
}
// 타입 

export type Role = "USER" | "OPERATOR" | "AUDITOR" | "ADMIN"

export type activaeType = "LOGIN" | "TEST"

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UserResponse {
  id: string;
  role: Role;
}

export class LoginDto {
  id: string;

  password: string;
}

export class RefreshDto {
  refreshToken: string;
}

export class UpdateRoleDto {
  id: string;

  role: Role;
}

export class RegisterDto {
  id: string;

  password: string;
}

export interface ActiveTypeCountResponse {
  [key: string]: number; // 예: { LOGIN: 5, TEST: 3 }
}
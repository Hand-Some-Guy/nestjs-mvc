// 타입 
export interface JwtPayload {
  sub: string;
  role: string;
}


// 컨트롤러, 서비스에서 통용되는 데이터 응답답 객체 
// DTO 
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UserResponse {
  id: string;
  role: string;
}

// 컨트롤러, 서비스에서 통용되는 데이터 수신 객체 
// DTO 
export class LoginDto {
  id: string;

  password: string;
}

export class RefreshDto {
  refreshToken: string;
}

export class UpdateRoleDto {
  targetid: string;

  role: string;
}

export class RegisterDto {
  id: string;

  password: string;
}
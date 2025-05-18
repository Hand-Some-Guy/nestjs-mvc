import { SetMetadata } from '@nestjs/common';

// 컨텍스트에 메타데이터 roles 파마리터를 설정 or 추가 한다.
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
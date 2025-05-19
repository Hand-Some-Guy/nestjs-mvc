import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenMongoose } from 'src/repository/refresh-token.repository';
import { UserMongoose } from 'src/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload, LoginDto, LoginResponse, RefreshDto, RefreshResponse, RegisterDto, UpdateRoleDto, UserResponse } from './dto/user.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserMongoose,
    private readonly refreshTokenRepository: RefreshTokenMongoose,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const duplicate = await this.userRepository.findById(registerDto.id);
    if (duplicate) {
      throw new UnauthorizedException('Duplicate user');
    }

    const user = await this.userRepository.create(registerDto.id, registerDto.password);
    return { id: user.getId(), role: user.getRole() };
  }

  async login(loginDTO: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findById(loginDTO.id);

    this.logger.log(`Login called with id: ${user.getId()} ${user.getPassword()}`);
    if (!user || !(await bcrypt.compare(loginDTO.password, user.getPassword()))) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload: JwtPayload = { sub: user.getId(), role: user.getRole() };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'your-refresh-secret-key',
      expiresIn: '7d',
    });

    // 기존 기록된 토큰 삭제 
    await this.refreshTokenRepository.delete(user.getId())
    // 신규 토큰 등록
    await this.refreshTokenRepository.create(user.getId(), refreshToken);
    // 로그인 기록 추가 

    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto): Promise<RefreshResponse> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: 'your-refresh-secret-key',
      });

      this.logger.log(`Login called with id: ${payload.sub}`);
      const token = await this.refreshTokenRepository.findById(payload.sub);
      if (!token || !(token.getToken() === refreshDto.refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }


      this.logger.log(`Login called with id: ${refreshDto.refreshToken}`);
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        role: payload.role,
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<UserResponse> {
    const user = await this.userRepository.findById(updateRoleDto.targetid);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.userRepository.updateRole(updateRoleDto.targetid, updateRoleDto.role);
    return { id: user.getId(), role: updateRoleDto.role };
  }

  
}

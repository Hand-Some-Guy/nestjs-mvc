import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenMongoose } from 'src/repository/refresh-token.repository';
import { UserMongoose } from 'src/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { ActiveTypeCountResponse, JwtPayload, LoginDto, LoginResponse, RefreshDto, RefreshResponse, RegisterDto, UpdateRoleDto, UserResponse } from './dto/user.dto';
import { ActivityHistoryMongoose } from 'src/repository/activity-history.repository';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserMongoose,
    private readonly refreshTokenRepository: RefreshTokenMongoose,
    private readonly activityHistoryRepository: ActivityHistoryMongoose,
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

    await this.refreshTokenRepository.delete(user.getId())
    await this.refreshTokenRepository.create(user.getId(), refreshToken);

    // 활동 이력 추가
    const now = new Date();
    await this.activityHistoryRepository.create(
      user.getId(),
      "LOGIN",
      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      now.toTimeString().split(' ')[0],
    );

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
    const user = await this.userRepository.findById(updateRoleDto.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // role 유효성 검사 
    if (!user.getRole()) {
      throw new UnauthorizedException('Invalid role');
    }


    await this.userRepository.updateRole(updateRoleDto.id, updateRoleDto.role);
    return { id: user.getId(), role: updateRoleDto.role };
  }

  async activeTypeCnt(uid: string): Promise<ActiveTypeCountResponse> {
    this.logger.log('ActiveTypeCnt called');
    try {
      const counts = await this.activityHistoryRepository.countByType(uid);
      return counts;
    } catch (error) {
      this.logger.error(`ActiveTypeCnt failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}

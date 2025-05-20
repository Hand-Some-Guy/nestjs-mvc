import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto, UpdateRoleDto } from './dto/user.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(loginDTO: LoginDto) {
    this.logger.log(`Login called with id: ${loginDTO.id} ${loginDTO.password}`);
    return this.authService.login(loginDTO);
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(refreshDto: RefreshDto) {
    this.logger.log(`Refresh called with token: ${refreshDto.refreshToken.substring(0, 10)}...`);
    return this.authService.refresh(refreshDto);
  }

  @MessagePattern({ cmd: 'updateRole' })
  async updateRole(updateRoleDto: UpdateRoleDto) {
    this.logger.log(`UpdateRole called with id: ${UpdateRoleDto}`);
    return this.authService.updateRole(updateRoleDto);
  }

  @MessagePattern({ cmd: 'register' })
  async register(registerDto: RegisterDto) {
    this.logger.log(`Register called with id: ${registerDto.id}`);
    return this.authService.register(registerDto); 
  }

  @MessagePattern({ cmd: 'test' })
  async test() {
    this.logger.log(`test called with id:`);
    return {}
  }

  @MessagePattern({ cmd: 'activeTypeCnt' })
  async activeTypeCnt(date: { uid: string }) {
    this.logger.log(`ActiveTypeCnt called`);
    try {
      return await this.authService.activeTypeCnt(date.uid);
    } catch (error) {
      this.logger.error(`ActiveTypeCnt failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
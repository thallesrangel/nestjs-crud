import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { ServicePasswordGroupService } from './service-password-group.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResetServicePasswordGroupDTO } from './dto/reset-service-password-group.dto';
import { AppGateway } from 'src/webSocketGateway/web-socket-gateway.gateway';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('service_password_groups')
export class ServicePasswordGroupController {
  constructor(
    private readonly servicePasswordGroupService: ServicePasswordGroupService,
    private readonly appGateway: AppGateway
  ) {}

  // @Roles(Role.Admin, Role.Manager, Role.User)
  // @Post()
  // create(@Body() { id_clinic }: CreateServicePasswordGroupDTO) {
  //   return this.servicePasswordGroupService.create(id_clinic);
  // }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('reset')
  reset(@Req() req) {

    const id_clinic = req.tokenPayload.id_clinic;

    const result = this.servicePasswordGroupService.reset({ id_clinic });

    if (!result) {
    }
    
    this.appGateway.sendMessageToRoom(id_clinic, { action: 'update' });

    return true;
  }
}

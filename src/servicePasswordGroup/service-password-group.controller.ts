import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ServicePasswordGroupService } from './service-password-group.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServicePasswordGroupDTO } from './dto/create-service-password-group.dto';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('service_password_groups')
export class ServicePasswordGroupController {
  constructor(
    private readonly servicePasswordGroupService: ServicePasswordGroupService,
  ) {}

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post()
  create(@Body() { id_clinic }: CreateServicePasswordGroupDTO) {
    return this.servicePasswordGroupService.create(id_clinic);
  }
}

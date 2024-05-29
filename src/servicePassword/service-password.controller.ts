import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServicePasswordDTO } from './dto/create-service-password.dto';
import { ServicePasswordService } from './service-password.service';
import { ServicePasswordGroupService } from 'src/servicePasswordGroup/service-password-group.service';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('service_passwords')
export class ServicePasswordController {
  constructor(
    private readonly servicePasswordService: ServicePasswordService,
    private readonly servicePasswordGroupService: ServicePasswordGroupService,
  ) {}

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post()
  async create(@Body() { id_patient, id_place }: CreateServicePasswordDTO, @Req() req) {

    const id_clinic = req.tokenPayload.id_clinic;
    
    // Verifica se existe um grupo ativo (deleted = false) para a clinica
    const checkExistsServicePasswordGroupActive = await this.servicePasswordGroupService.existis(id_clinic);
  
    var servicePasswordGroupId: number;
    
    // Verifica se o grupo de senhas existe, caso não existir ele cria um novo grupo e retorna o ID - id_service_password_group
    if (!checkExistsServicePasswordGroupActive) {
      const createServicePasswordGroup = await this.servicePasswordGroupService.create(id_clinic);
      var servicePasswordGroupId = createServicePasswordGroup.id;
    } else {
      var servicePasswordGroupId = checkExistsServicePasswordGroupActive.id;
    }

    servicePasswordGroupId = Number(servicePasswordGroupId);

    // Verifica a última senha criada na tabela servicePassword usando as colunas id_clinic e id_service_group_id
    const lastServicePasswordGenerated = await this.servicePasswordService.lastServicePasswordGenerated(id_clinic, servicePasswordGroupId);

    if (lastServicePasswordGenerated) {
      var nextPasswordNumber = lastServicePasswordGenerated.number + 1;
    } else {
      var nextPasswordNumber = 1; 
    }

    return this.servicePasswordService.create({
      id_service_password_group: servicePasswordGroupId,
      id_clinic: Number(id_clinic),
      id_patient: id_patient ?? null,
      id_place,
      number: nextPasswordNumber,
    });
  }
}

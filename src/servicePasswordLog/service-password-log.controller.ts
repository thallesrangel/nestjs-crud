import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServicePasswordLogDTO } from './dto/create-service-password-log.dto';
import { ServicePasswordServiceLog } from './service-password-log.service';
import { ServicePasswordGroupService } from 'src/servicePasswordGroup/service-password-group.service';
import { ServicePasswordService } from 'src/servicePassword/service-password.service';
import { PasswordStatus } from '@prisma/client';
import { PasswordTypeLog } from 'src/enums/service-password-type-log.enum';
import { PatientService } from 'src/patient/patient.service';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('service_password_logs')
export class ServicePasswordLogController {
  constructor(
    private readonly servicePasswordService: ServicePasswordService,
    private readonly servicePasswordServiceLog: ServicePasswordServiceLog,
    private readonly patientService: PatientService,
    // private readonly servicePasswordGroupService: ServicePasswordGroupService,
  ) {}

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Get('password_history')
  async getAllByClinicId(@Req() req) {

    const clinicId = req.tokenPayload.id_clinic;

    return this.servicePasswordServiceLog.getAllByClinicId(clinicId);
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post()
  async create(@Body() { id_password_service, id_place, guiche, patient_name }) {
    // Vou pegar o id_service_password e todas as suas infos, e duplicar para uma tabela de password_logs
    // Após duplicar o registro, apenas vou alterar o place_id da senha atual para um novo, trocar o status para "aguardando" e redirect true.
    const checkExistsServicePasswordActive =
      await this.servicePasswordService.show(id_password_service);

    if (!checkExistsServicePasswordActive) {
      throw new UnauthorizedException('Não foi possível encontrar a senha.');
    }

    var patientId: number;

    if (!checkExistsServicePasswordActive.id_patient && patient_name && patient_name.trim() !== '') {

      const createPatientDTO = {
        id_clinic: checkExistsServicePasswordActive.clinic.id,
        name: patient_name
      };

      const patient = await this.patientService.create(createPatientDTO);

      patientId = patient.id;
      
    } else if (checkExistsServicePasswordActive.id_patient) {
      patientId = checkExistsServicePasswordActive.id_patient;
    } else {
      patientId = null;
    }
    
    console.log(patientId)

    const createLog = await this.servicePasswordServiceLog.create({
      id_clinic: checkExistsServicePasswordActive.clinic.id,
      id_service_password_group:
        checkExistsServicePasswordActive.id_service_password_group,
      id_service_password: checkExistsServicePasswordActive.id,
      id_patient: patientId,
      id_place: checkExistsServicePasswordActive.id_place,
      guiche,
      number: checkExistsServicePasswordActive.number,
      type: checkExistsServicePasswordActive.type as PasswordTypeLog,
    });

    if (createLog) {
      const id = Number(id_password_service);
      const place = Number(id_place);
      // Define um novo id_place para a mesma senha, após criar um log dela e define como "aguardando" = reaproveitamente de senha poŕem vai ser chamado em outro local
      const result =
        await this.servicePasswordService.setStatusAwaitingServiceNewPlace(
          id,
          place,
        );

      if (!result) {
        return false;
      }

      return true;
    }
  }
}

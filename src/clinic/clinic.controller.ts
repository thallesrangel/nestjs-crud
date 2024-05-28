import {
    Body,
    Controller,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { ClinicService } from './clinic.service';
  import { Roles } from 'src/decorators/role.decorator';
  import { Role } from 'src/enums/role.enum';
  import { RoleGuard } from 'src/guards/role.guard';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { CreateClinicDTO } from './dto/create-clinic.dto';
  
  // AuthGuard verifica se está autenticado
  // Role verifica a permissão
  @UseGuards(AuthGuard, RoleGuard)
  @Controller('clinics')
  export class ClinicController {
    constructor(private readonly clinicService: ClinicService) {}
  
    @Roles(Role.Admin, Role.Manager)
    @Post()
    create(@Body() { name }: CreateClinicDTO) {
  
      return this.clinicService.create({ name });
    }
  }
  
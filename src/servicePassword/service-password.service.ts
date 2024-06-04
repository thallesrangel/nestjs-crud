import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicePasswordDTO } from './dto/create-service-password.dto';
import { PasswordStatus } from 'src/enums/service-passowrd-status.enum';
import { PasswordType } from 'src/enums/service-password-type.enum';

@Injectable()
export class ServicePasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    id_service_password_group,
    id_clinic,
    id_patient,
    id_place,
    number,
    type,
  }: CreateServicePasswordDTO) {
    const data = {
      id_service_password_group,
      id_clinic,
      id_patient: id_patient ?? null,
      id_place,
      number,
      type,
      status: PasswordStatus.aguardando,
    };

    return await this.prisma.servicePassword.create({
      data: data as any,
      select: {
        id: true,
        id_service_password_group: true,
        id_clinic: true,
        id_patient: true,
        id_place: true,
        number: true,
        type: true,
        status: true,
        deleted: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async lastServicePasswordGenerated(id_clinic: number, id_service_password_group: number) {
    const lastData = await this.prisma.servicePassword.findFirst({
      where: {
        id_clinic,
        id_service_password_group,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!lastData) {
      return false;
    }

    return lastData;
  }

  async show(id: number) {
    const record = await this.prisma.servicePassword.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        patient: true,
        clinic: true,
        servicePasswordGroup: true,
      }
    });
  
    if (!record) {
      return false;
    }
  
    return record;
  }

  async getAllPasswordsAwaitingServiceByPlace(id_clinic: number, id_place: number) {
    return this.prisma.servicePassword.findMany({
      where: {
        id_clinic,
        id_place,
        servicePasswordGroup: {
          deleted: false,
        },
        status: PasswordStatus.aguardando
      },
      orderBy: {
        number: 'asc',
      },
    });
  }

  async setStatusEmAtendimento(id: number, guiche: string) {
    return await this.prisma.servicePassword.update({
      where: {
        id,
      },
      data: {
        status: PasswordStatus.em_atendimento,
        guiche: guiche ? guiche : null
      },
    });
  }

  async setStatusServiced(id_password_service: number) {
    return await this.prisma.servicePassword.update({
      where: {
        id: id_password_service,
      },
      data: {
        status: PasswordStatus.atendida,
      },
    });
  }

  async getAtualSenhaEmAtendimento(id_clinic: number, id_place: number) {
    const record = await this.prisma.servicePassword.findFirst({
      where: {
        id_clinic,
        id_place,
        servicePasswordGroup: {
          deleted: false,
        },
        status: PasswordStatus.em_atendimento
      },
      include: {
        patient: true,
        clinic: true,
        servicePasswordGroup: true,
        place: true
      }
    });
  
    if (!record) {
      return false;
    }
  
    return record;
  }

  async setStatusAwaitingServiceNewPlace(id_password_service, id_place) {
    return await this.prisma.servicePassword.update({
      where: {
        id: id_password_service,
      },
      data: {
        id_place: id_place,
        status: PasswordStatus.aguardando,
      },
    });
  }
}

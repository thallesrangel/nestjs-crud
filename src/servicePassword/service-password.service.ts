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
  }: CreateServicePasswordDTO) {
    const data = {
      id_service_password_group,
      id_clinic,
      id_patient: id_patient ?? null,
      id_place,
      number,
      type: PasswordType.normal,
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
}

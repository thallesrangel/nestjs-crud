import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicePasswordServiceLog {
  constructor(private readonly prisma: PrismaService) {}

  async getLastInsertedByClinicId(id_clinic: number) {
    return await this.prisma.servicePasswordLog.findFirst({
      where: {
        id_clinic,
        deleted: false,
        servicePasswordGroup: {
          deleted: false,
        },
      },
      include: {
        patient: true,
        place: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getAllByClinicId(id_clinic: number) {
    return await this.prisma.servicePasswordLog.findMany({
      where: {
        id_clinic,
        deleted: false,
        servicePasswordGroup: {
          deleted: false,
        },
      },
      include: {
        patient: true,
        place: true,
      },
      orderBy: {
        id: 'desc',
      },
      take: 5,
    });
  }

  async create({
    id_clinic,
    id_service_password_group,
    id_service_password,
    id_patient,
    id_place,
    guiche,
    number,
    type,
  }) {
    const data = {
      number,
      type,
      guiche,
      clinic: { connect: { id: id_clinic } },
      servicePasswordGroup: { connect: { id: id_service_password_group } },
      servicePassword: { connect: { id: id_service_password } },
      place: { connect: { id: id_place } },
      patient: undefined,
    };

    if (id_patient) {
      data.patient = { connect: { id: id_patient } };
    }

    return await this.prisma.servicePasswordLog.create({
      data: data as any,
    });
  }
}

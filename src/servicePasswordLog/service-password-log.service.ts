import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicePasswordServiceLog {
  constructor(private readonly prisma: PrismaService) {}
  
  
  async create({
    id_clinic,
    id_service_password_group,
    id_service_password,
    id_patient,
    id_place,
    number,
    type,
  }) {

    const data = {
      number,
      type,
      clinic: { connect: { id: id_clinic } },
      servicePasswordGroup: { connect: { id: id_service_password_group } },
      servicePassword: { connect: { id: id_service_password } },
      place: { connect: { id: id_place } }
    };

    return await this.prisma.servicePasswordLog.create({
      data: data as any
    });
  }
}

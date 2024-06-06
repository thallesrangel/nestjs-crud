import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDTO } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ id_clinic, name }: CreatePatientDTO) {
    return await this.prisma.patient.create({
      data: {
        id_clinic,
        name,
      },
      select: {
        id: true,
        id_clinic: true,
        name: true,
      },
    });
  }
}

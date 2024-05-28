import { Injectable } from '@nestjs/common';
import { CreateClinicDTO } from './dto/create-clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: CreateClinicDTO) {

    return await this.prisma.clinic.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
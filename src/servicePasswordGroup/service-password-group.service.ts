import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicePasswordGroupDTO } from './dto/create-service-password-group.dto';
import { ResetServicePasswordGroupDTO } from './dto/reset-service-password-group.dto';

@Injectable()
export class ServicePasswordGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id_clinic: number ) {
    return await this.prisma.servicePasswordGroup.create({
      data: {
        id_clinic,
      },
      select: {
        id: true,
        id_clinic: true,
        deleted: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async existis(id_clinic: number) {
    const record = await this.prisma.servicePasswordGroup.findFirst({
      where: {
        id_clinic,
        deleted: false,
      },
    });
  
    if (!record) {
      return false;
    }
  
    return record;
  }

  async reset({ id_clinic }: ResetServicePasswordGroupDTO) {
    return await this.prisma.servicePasswordGroup.updateMany({
      where: {
        id_clinic,
      },
      data: {
        deleted: true,
      },
    });
  }
}

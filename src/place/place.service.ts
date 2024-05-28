import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDTO } from './dto/create-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, show_on_totem }: CreatePlaceDTO, userId) {
    return await this.prisma.place.create({
      data: {
        name,
        show_on_totem,
        userId,
      },
      select: {
        id: true,
        name: true,
        show_on_totem: true,
        userId: true,
      },
    });
  }

  async read(id) {
    return this.prisma.place.findMany({
      where: {
        userId: id,
      },
    });
  }

  async existis(id: number) {
    if (
      !(await this.prisma.place.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
  }

  async delete(id: number) {
    await this.existis(id);

    return await this.prisma.place.delete({
      where: {
        id,
      },
    });
  }
}

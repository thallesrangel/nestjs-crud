import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDTO } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id_clinic, { name, show_on_totem }: CreatePlaceDTO) {
    return await this.prisma.place.create({
      data: {
        id_clinic,
        name,
        show_on_totem,
      },
      select: {
        id: true,
        id_clinic: true,
        name: true,
        show_on_totem: true,
      },
    });
  }

  async read(id) {
    return this.prisma.place.findMany({
      where: {
        id_clinic: id,
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

  async update(placeId: number, updatePlaceDto: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: { id: placeId },
      data: updatePlaceDto,
    });
  }
}

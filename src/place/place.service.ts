import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDTO } from './dto/create-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, show_on_totem, userId }: CreatePlaceDTO) {
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
        userId: id
      }
    });
  }
}

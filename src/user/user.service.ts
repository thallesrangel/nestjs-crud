import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async existis(id: number) {
    if (!(await this.show(id))) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async delete(id: number) {
    await this.existis(id);

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bycrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    id_clinic,
    name,
    email,
    password,
    role,
    guiche,
  }: CreateUserDTO) {
    password = await bycrypt.hash(password, await bycrypt.genSalt());

    return await this.prisma.user.create({
      data: {
        id_clinic,
        email,
        name,
        password,
        role,
        guiche,
      },
      select: {
        id: true,
        id_clinic: true,
        name: true,
        email: true,
        role: true,
        guiche: true,
      },
    });
  }

  async read(id_clinic?: number) {
    const whereClause = id_clinic ? { id_clinic } : {};

    return this.prisma.user.findMany({
      where: whereClause,
    });
  }

  async show(id: number) {
    await this.existis(id);

    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        id_clinic: true,
        email: true,
        name: true,
        role: true,
        guiche: true,
      },
    });
  }

  async existis(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
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

  async update(userId: number, updateUserDTO: UpdateUserDTO) {
    if (updateUserDTO.password) {
      console.log("oi")
      updateUserDTO.password = await bycrypt.hash(
        updateUserDTO.password,
        await bycrypt.genSalt(),
      );
    } else {
      delete updateUserDTO.password;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDTO,
    });
  }
}

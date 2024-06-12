import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // async createToken(user: User) {
  createToken(user) {
    return {
      accesToken: this.jwtService.sign(
        {
          id: user.id,
          id_clinic: user.id_clinic,
          name: user.name,
          email: user.email,
          role: user.role, //?
          guiche: user.guiche,
          clinic: user.clinic,
        },
        {
          expiresIn: '2 days',
          subject: String(user.id),
          issuer: 'direct_queue',
          audience: 'login',
        },
      ),
      user: user,
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: 'login',
        issuer: 'direct_queue',
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        clinic: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    if (!await bycrypt.compare(password, user.password)) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos. Tente novamente.');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto.');
    }

    //TODO Enviar email aqui
    return user;
  }

  async reset(password: string, token: string) {
    //TODO validando o token, troco a senha
    //TODO Token possui ID
    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {

    const existingUser = await this.userService.findByEmail(data.email);
    
    if (existingUser) {
      throw new BadRequestException('O e-mail já está em uso.');
    }

    return await this.userService.create(data);
  }

  async registerPublic(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}

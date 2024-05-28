import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin, Role.Manager)
  @Post()
  create(@Body() { id_clinic, email, name, password, role }: CreateUserDTO) {
    return this.userService.create({ id_clinic, name, email, password, role});
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Get()
  read() {
    return this.userService.read();
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.Admin, Role.Manager)
  @Put(':id')
  updateTotal(@Body() body, @Param() param) {
    return {
      method: 'Put',
      body,
      param,
    };
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Patch(':id')
  updatePartial(@Body() body, @Param() param) {
    return {
      method: 'Patch',
      body,
      param,
    };
  }

  @Roles(Role.Admin, Role.Manager)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

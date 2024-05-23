import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
// import { AppService } from './app.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() {email, name, password }: CreateUserDTO) {
    return this.userService.create({email, name, password});
  }

  @Get()
  read() {
    return this.userService.list();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id)
  }

  @Put(':id')
  updateTotal(@Body() body, @Param() param) {
    return {
        method: 'Put', 
        body, 
        param
    };
  }

  @Patch(':id')
  updatePartial(@Body() body, @Param() param) {
    return {
        method: 'Patch', 
        body, 
        param
    };
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}

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
  Req,
  Request,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePlaceDTO } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Roles(Role.Admin, Role.Manager)
  @Post()
  create(@Body() { name, show_on_totem }: CreatePlaceDTO, @Req() req) {
    const clinicId = req.tokenPayload.id_clinic;

    return this.placeService.create(clinicId, { name, show_on_totem });
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Get()
  read(@Request() param) {
    const clinicId = param.tokenPayload.id_clinic;

    return this.placeService.read(clinicId);
  }

  @Roles(Role.Admin, Role.Manager)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {

    return this.placeService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }
}

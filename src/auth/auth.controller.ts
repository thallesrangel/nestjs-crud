import { Body, Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { ClinicService } from 'src/clinic/clinic.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly clinicService: ClinicService,
  ) {}

  @Post('login')
  async login(@Body() {email, password}: AuthLoginDTO) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    const name = body.clinic_name
    const lastInsert = await this.clinicService.create({name});

    if (!lastInsert || !lastInsert.id) {
      throw new UnauthorizedException('Não foi possível criar uma clínica');
    }

    const bodyWithClinicId = { ...body, id_clinic: lastInsert.id };

    return this.authService.register(bodyWithClinicId);
  }

  // Send a email to reset your password
  @Post('forget')
  async forget(@Body() body: AuthForgetDTO) {
    return this.authService.forget(body.email)
  }

  // after you click on link, send newpassword with jwt token
  @Post('reset')
  async reset(@Body() {password, token}: AuthResetDTO) {
    return this.authService.reset(password, token);
  }


  @UseGuards(AuthGuard)
  @Post('me')
  async me(@UserDecorator() user) {
    return {user}
  } 


  // @UseGuards(AuthGuard)
  // @Post('me')
  // async me(@Req() req) {
  //   return {me: "ok", data: req.tokenPayload, user: req.user}
  // } 
}

import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.model';
import { ServicePasswordController } from './service-password.controller';
import { ServicePasswordService } from './service-password.service';
import { AuthModule } from 'src/auth/auth.module';
import { servicePasswordGroupModule } from 'src/servicePasswordGroup/service-password-group.module';
import { ServicePasswordLogModule } from 'src/servicePasswordLog/service-password-log.module';
import { GatewayModule } from 'src/webSocketGateway/gateway.module';
import { AppGateway } from 'src/webSocketGateway/web-socket-gateway.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => servicePasswordGroupModule),
    forwardRef(() =>  ServicePasswordLogModule),
    forwardRef(() =>  GatewayModule),
  ],

  controllers: [ServicePasswordController],
  providers: [ServicePasswordService, AppGateway],
  exports: [ServicePasswordService]
})
export class ServicePasswordModule {}

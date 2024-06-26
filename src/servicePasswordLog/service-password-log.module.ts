import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.model';
import { ServicePasswordLogController } from './service-password-log.controller';
import { ServicePasswordServiceLog } from './service-password-log.service';
import { AuthModule } from 'src/auth/auth.module';
import { ServicePasswordModule } from 'src/servicePassword/service-password.module';
import { servicePasswordGroupModule } from 'src/servicePasswordGroup/service-password-group.module';
import { PatientModule } from 'src/patient/patient.module';
import { AppGateway } from 'src/webSocketGateway/web-socket-gateway.gateway';
import { GatewayModule } from 'src/webSocketGateway/gateway.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ServicePasswordModule),
    forwardRef(() => servicePasswordGroupModule),
    forwardRef(() => PatientModule),
    forwardRef(() => GatewayModule),
  ],

  controllers: [ServicePasswordLogController],
  providers: [ServicePasswordServiceLog, AppGateway],
  exports: [ServicePasswordServiceLog],
})
export class ServicePasswordLogModule {}

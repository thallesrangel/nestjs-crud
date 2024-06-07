import { Module, forwardRef } from '@nestjs/common';
import { AppGateway } from './web-socket-gateway.gateway';
import { PrismaModule } from 'src/prisma/prisma.model';
import { JwtModule } from '@nestjs/jwt';
import { ServicePasswordModule } from 'src/servicePassword/service-password.module';
import { ServicePasswordLogModule } from 'src/servicePasswordLog/service-password-log.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    forwardRef(() =>  ServicePasswordModule),
    forwardRef(() =>  ServicePasswordLogModule),
  ],
  providers: [AppGateway],
})
export class GatewayModule {}


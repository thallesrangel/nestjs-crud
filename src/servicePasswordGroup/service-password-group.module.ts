import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.model';
import { ServicePasswordGroupService } from './service-password-group.service';
import { ServicePasswordGroupController } from './service-password-group.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
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
    forwardRef(() =>  GatewayModule),
  ],
  controllers: [ServicePasswordGroupController],
  providers: [ServicePasswordGroupService, AppGateway],
  exports: [ServicePasswordGroupService]
})
export class servicePasswordGroupModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.model';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'NEIW2H#G@rnWhq55t7i5oXiTFwAiGRJz',
    }),
    UserModule,
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: []
})
export class AuthModule {}

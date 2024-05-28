import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.model';
import { ClinicController } from './clinic.controller';
import { ClinicService } from './clinic.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    //forwardRef(() => UserModule),
    PrismaModule,
    //forwardRef(() => AuthModule)
  ],
  controllers: [],
  providers: [ClinicService],
  exports: [ClinicService]
})
export class ClinicModule {}

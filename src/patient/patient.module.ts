import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.model';
import { AuthModule } from 'src/auth/auth.module';
import { PatientService } from './patient.service';
import { ServicePasswordLogModule } from 'src/servicePasswordLog/service-password-log.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => ServicePasswordLogModule),
    PrismaModule,
    forwardRef(() => AuthModule)
  ],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule {}

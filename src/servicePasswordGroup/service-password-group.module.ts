import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.model';
import { ServicePasswordGroupService } from './service-password-group.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [ServicePasswordGroupService],
  exports: [ServicePasswordGroupService]
})
export class servicePasswordGroupModule {}

import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.model';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService]
})
export class PlaceModule {}

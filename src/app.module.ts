import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PlaceModule } from './place/place.module';
import { ServicePasswordModule } from './servicePassword/service-password.module';
import { servicePasswordGroupModule } from './servicePasswordGroup/service-password-group.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PlaceModule),
    forwardRef(() => ServicePasswordModule),
    forwardRef(() => servicePasswordGroupModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

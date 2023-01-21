import { UserExists } from './user/user.middleware';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { RequestMethod } from '@nestjs/common/enums';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExists)
      .forRoutes({ path: 'api/v1/users/:id', method: RequestMethod.ALL });
  }
}

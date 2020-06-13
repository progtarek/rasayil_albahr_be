import { UsersModule } from './modules/users/users.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MessagesModule } from './modules/messages/messages.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

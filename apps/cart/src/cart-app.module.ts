import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CartModule,
    ConfigModule.forRoot({
      isGlobal: true,
			envFilePath: `./apps/cart/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision', 'staging')
          .default('development'),
        PORT: Joi.number(),
        MONGODB_URI: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        dbName: configService.get('MONGODB_DBNAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class CartAppModule { }

import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

@Module({
	imports: [
		ProductsModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./apps/products/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number(),
				MONGODB_URI: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: false,
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
		CategoriesModule,
		ManufacturersModule,
	],
	controllers: [],
	providers: [],
})
export class ProductsAppModule {}

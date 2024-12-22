import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturersRepository } from './manufacturers.repository';
import {
	Manufacturer,
	ManufacturerSchema,
} from './schema/manufacturers.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Manufacturer.name, schema: ManufacturerSchema },
		]),
	],
	controllers: [ManufacturersController],
	providers: [ManufacturersService, ManufacturersRepository],
	exports: [ManufacturersService],
})
export class ManufacturersModule {}

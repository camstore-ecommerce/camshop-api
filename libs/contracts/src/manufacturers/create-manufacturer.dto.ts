import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturerDto {
	@IsString()
	@IsNotEmpty()
	name: string;
}

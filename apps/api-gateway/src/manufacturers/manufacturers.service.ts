import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import {
	CreateManufacturerDto as ClientCreateManufacturerDto,
	UpdateManufacturerDto as ClientUpdateManufacturerDto,
	ManufacturersServiceClient,
	MANUFACTURERS_SERVICE_NAME,
} from '@app/contracts/manufacturers';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ManufacturersService implements OnModuleInit {
	private manufacturersServiceClient: ManufacturersServiceClient;

	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.manufacturersServiceClient =
			this.productsClient.getService<ManufacturersServiceClient>(
				MANUFACTURERS_SERVICE_NAME,
			);
	}

	create(createManufacturerDto: ClientCreateManufacturerDto) {
		return this.manufacturersServiceClient.create(createManufacturerDto);
	}

	findAll() {
		return this.manufacturersServiceClient.findAll({});
	}

	findOne(id: string) {
		return this.manufacturersServiceClient.findOne({ id }).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}

	update(id: string, updateManufacturerDto: ClientUpdateManufacturerDto) {
		return this.manufacturersServiceClient.update({
			id,
			...updateManufacturerDto,
		}).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}

	remove(id: string) {
		return this.manufacturersServiceClient.remove({ id }).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}

	permanentlyRemove(id: string) {
		return this.manufacturersServiceClient.permanentlyRemove({ id }).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}
}

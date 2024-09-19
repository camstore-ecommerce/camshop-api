import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import {
	MANUFACTURERS_PATTERNS,
	CreateManufacturerDto as ClientCreateManufacturerDto,
	UpdateManufacturerDto as ClientUpdateManufacturerDto,
	ManufacturerDto as ClientManufacturerDto,
} from '@app/contracts/manufacturers';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ManufacturersService {
	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientProxy,
	) {}

	create(createManufacturerDto: ClientCreateManufacturerDto) {
		return this.productsClient
			.send<
				ClientManufacturerDto,
				ClientCreateManufacturerDto
			>(MANUFACTURERS_PATTERNS.CREATE, createManufacturerDto)
			.pipe(map((response) => ({ id: response._id, name: response.name })));
	}

	findAll() {
		return this.productsClient.send(MANUFACTURERS_PATTERNS.FIND_ALL, {});
	}

	findOne(id: string) {
		return this.productsClient.send(MANUFACTURERS_PATTERNS.FIND_ONE, id);
	}

	update(id: string, updateManufacturerDto: ClientUpdateManufacturerDto) {
		return this.productsClient.send(MANUFACTURERS_PATTERNS.UPDATE, {
			id,
			...updateManufacturerDto,
		});
	}

	remove(id: string) {
		return this.productsClient.send(MANUFACTURERS_PATTERNS.REMOVE, id);
	}

	permanentlyRemove(id: string) {
		return this.productsClient.send(
			MANUFACTURERS_PATTERNS.PERMANENTLY_REMOVE,
			id,
		);
	}
}

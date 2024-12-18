import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import { Pagination } from '@app/common/interfaces';
import { CreateInventoryDto, INVENTORY_SERVICE_NAME, InventoryServiceClient, UpdateInventoryDto, UpdateReservedStockDto } from '@app/contracts/inventory';
import { FilterInventoryDto } from '@app/contracts/inventory/filter-inventory.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class InventoryService implements OnModuleInit {
  private inventoryServiceClient: InventoryServiceClient;

  constructor(
    @Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
  ) {}

  onModuleInit() {
		this.inventoryServiceClient =
			this.productsClient.getService<InventoryServiceClient>(
				INVENTORY_SERVICE_NAME,
			);
	}

  create(createInventoryDto: CreateInventoryDto) {
    return this.inventoryServiceClient.create(createInventoryDto);
  }

  findAll(pagination: Pagination) {
    return this.inventoryServiceClient.findAll(pagination);
  }

  filter(filterInventoryDto: FilterInventoryDto ) {
    console.log('filterInventoryDto', filterInventoryDto);
    return this.inventoryServiceClient.filter(filterInventoryDto);
  }

  findOne(id: string) {
    return this.inventoryServiceClient.findOne({ id });
  }

  update(id: string, updateInventoryDto: UpdateInventoryDto) {
    console.log('updateInventoryDto', updateInventoryDto);
    return this.inventoryServiceClient.update({ id, ...updateInventoryDto });
  }

  remove(id: string) {
    return this.inventoryServiceClient.remove({ id });
  }

  permanentlyRemove(id: string) {
    return this.inventoryServiceClient.permanentlyRemove({ id });
  }

  reserveStock(updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryServiceClient.reserveStock(updateReservedStockDto);
  }

  releaseStock(updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryServiceClient.releaseStock(updateReservedStockDto);
  }
}

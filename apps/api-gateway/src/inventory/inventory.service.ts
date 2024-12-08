import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import { CreateInventoryDto, INVENTORY_SERVICE_NAME, InventoryServiceClient, UpdateInventoryDto, UpdateReservedStockDto } from '@app/contracts/inventory';
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

  findAll() {
    return this.inventoryServiceClient.findAll({});
  }

  findOne(id: string) {
    return this.inventoryServiceClient.findOne({ id });
  }

  update(id: string, updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryServiceClient.update({ id, ...updateInventoryDto });
  }

  remove(id: string) {
    return this.inventoryServiceClient.remove({ id });
  }

  permanentlyRemove(id: string) {
    return this.inventoryServiceClient.permanentlyRemove({ id });
  }

  findByProduct(product_id: string) {
    return this.inventoryServiceClient.findByProduct({ product_id });
  }

  reserveStock(updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryServiceClient.reserveStock(updateReservedStockDto);
  }

  releaseStock(updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryServiceClient.releaseStock(updateReservedStockDto);
  }
}

import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory as InventorySchema } from './schema/inventory.schema';
import {
  CreateInventoryDto,
  FindByIdsDto,
  Inventories, 
  InventoryId, 
  InventoryServiceController, 
  InventoryServiceControllerMethods, 
  UpdateInventoryDto, UpdateReservedStockDto
} from '@app/contracts/inventory';
import { Pagination } from '@app/common/interfaces';
import { FilterInventoryDto } from '@app/contracts/inventory/filter-inventory.dto';

@Controller()
@InventoryServiceControllerMethods()
export class InventoryController implements InventoryServiceController {
  constructor(private readonly inventoryService: InventoryService) { }

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoryService.create(createInventoryDto);
    return this.inventoryService.toInventory(inventory);
  }

  async update(updateInventoryDto: UpdateInventoryDto) {
    console.log('updateInventoryDto', updateInventoryDto);
    const inventory = await this.inventoryService.update(updateInventoryDto.id, updateInventoryDto);
    return this.inventoryService.toInventory(inventory);
  }

  async findAll(pagination: Pagination): Promise<Inventories> {
    const inventories = await this.inventoryService.findAll(pagination);
    return {
      ...inventories,
      inventories: inventories.inventories.map(inventory => this.inventoryService.toInventory(inventory)),
    }
  }

  async filter(filterInventoryDto: FilterInventoryDto) {
    const inventories = await this.inventoryService.filter(filterInventoryDto);
    return {
      ...inventories,
      inventories: inventories.inventories.map(inventory => this.inventoryService.toInventory(inventory)),
    }
  }

  async findOne(inventoryId: InventoryId) {
    const inventory = await this.inventoryService.findOne(inventoryId.id);
    return this.inventoryService.toInventory(inventory);
  }

  async findByIds(findByIdsDto: FindByIdsDto) {
		const inventories = await this.inventoryService.findByIds(findByIdsDto.ids);
		return {
			...inventories,
			inventories: inventories.inventories.map((product) =>
				this.inventoryService.toInventory(product)
			),
		};
	}

  async remove(inventoryId: InventoryId) {
    return await this.inventoryService.remove(inventoryId.id);
  }

  async permanentlyRemove(inventoryId: InventoryId) {
    return await this.inventoryService.permanentlyRemove(inventoryId.id);
  }

  async reserveStock(updateReservedStockDto: UpdateReservedStockDto) {
    const inventory = await this.inventoryService.reserveStock(updateReservedStockDto.id, updateReservedStockDto.reserved_stock);
    return this.inventoryService.toInventory(inventory);
  }

  async releaseStock(updateReservedStockDto: UpdateReservedStockDto) {
    const inventory = await this.inventoryService.releaseStock(updateReservedStockDto.id, updateReservedStockDto.reserved_stock);
    return this.inventoryService.toInventory(inventory);
  }
}

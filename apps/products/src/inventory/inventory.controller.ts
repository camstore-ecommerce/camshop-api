import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory as InventorySchema } from './schema/inventory.schema';
import {
  CreateInventoryDto,
  FindInventoryByProductDto, 
  Inventories, 
  InventoryId, 
  InventoryServiceController, 
  InventoryServiceControllerMethods, 
  UpdateInventoryDto, UpdateReservedStockDto
} from '@app/contracts/inventory';

@Controller()
@InventoryServiceControllerMethods()
export class InventoryController implements InventoryServiceController {
  constructor(private readonly inventoryService: InventoryService) { }

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.inventoryService.create(createInventoryDto);
    return this.inventoryService.toInventory(inventory);
  }

  async update(updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryService.update(updateInventoryDto.id, updateInventoryDto);
    return this.inventoryService.toInventory(inventory);
  }

  async findByProduct(findInventoryByProductDto: FindInventoryByProductDto) {
    const inventories = await this.inventoryService.findByProduct(findInventoryByProductDto.product_id);
    return {
      ...inventories,
      inventories: inventories.inventories.map(inventory => this.inventoryService.toInventory(inventory)),
    }
  }

  async findAll(): Promise<Inventories> {
    const inventories = await this.inventoryService.findAll();
    return {
      ...inventories,
      inventories: inventories.inventories.map(inventory => this.inventoryService.toInventory(inventory)),
    }
  }

  async findOne(inventoryId: InventoryId) {
    const inventory = await this.inventoryService.findOne(inventoryId.id);
    return this.inventoryService.toInventory(inventory);
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

import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { ProductsService } from '../products/products.service';
import { CreateInventoryDto, Inventory, UpdateInventoryDto } from '@app/contracts/inventory';
import { Inventory as InventorySchema } from './schema/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly productsService: ProductsService,
  ) { }

  /**
   *  Convert InventorySchema to proto Inventory
   * @param inventory 
   * @returns 
   */
  toInventory(inventory: InventorySchema): Inventory {
    return {
      id: inventory._id.toString(),
      ...inventory,
      product: this.productsService.toProduct(inventory.product, inventory.product.category, inventory.product.manufacturer),
    }
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const product = await this.productsService.findOne(createInventoryDto.product_id);

    return await this.inventoryRepository.create({
      ...createInventoryDto,
      product,
      reserved_stock: 0,
    });
  }

  async update(_id: string, updateInventoryDto: UpdateInventoryDto) {
    const existInventory = await this.inventoryRepository.findOne({ _id });

    if( updateInventoryDto.product_id ) {
      existInventory.product = await this.productsService.findOne(updateInventoryDto.product_id);
    }

    return await this.inventoryRepository.findOneAndUpdate({_id}, {...existInventory, ...updateInventoryDto});
  }

  async findByProduct(product_id: string) {
    const inventories = await this.inventoryRepository.find({ product: product_id });
    return {
      count: inventories.length,
      inventories
    }
  }

  async findAll() {
    const inventories = await this.inventoryRepository.find({});
    return {
      count: inventories.length,
      inventories
    }
  }

  async findOne(_id: string) {
    return await this.inventoryRepository.findOne({ _id });
  }

  async remove(_id: string) {
		return await this.inventoryRepository.softDelete({ _id });
	}

  async permanentlyRemove(_id: string) {
    return await this.inventoryRepository.findOneAndDelete({ _id });
  }

  async reserveStock(_id: string, quantity: number) {
    const existInventory = await this.inventoryRepository.findOne({ _id });

    existInventory.reserved_stock += quantity;

    return await this.inventoryRepository.findOneAndUpdate({ _id }, existInventory);
  }

  async releaseStock(_id: string, quantity: number) {
    const existInventory = await this.inventoryRepository.findOne({ _id });

    existInventory.reserved_stock -= quantity;

    return await this.inventoryRepository.findOneAndUpdate({ _id }, existInventory);
  }
}

import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { ProductsService } from '../products/products.service';
import { CreateInventoryDto, Inventory, UpdateInventoryDto } from '@app/contracts/inventory';
import { Inventory as InventorySchema } from './schema/inventory.schema';
import { Pagination } from '@app/common/interfaces';
import { handlePagination } from '@app/common/utils';
import { FilterInventoryDto } from '@app/contracts/inventory/filter-inventory.dto';

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

    const inventory = await this.inventoryRepository.create({
      ...createInventoryDto,
      product,
      reserved_stock: 0,
    });

    return {
      ...inventory,
      product: product
    }
  }

  async update(_id: string, updateInventoryDto: UpdateInventoryDto) {
    const existInventory = await this.inventoryRepository.findOne({ _id });

    if (updateInventoryDto.product_id) {
      existInventory.product = await this.productsService.findOne(updateInventoryDto.product_id);
    }

    return await this.inventoryRepository.findOneAndUpdate({ _id }, { ...existInventory, ...updateInventoryDto });
  }

  async findAll(pagination: Pagination) {
    const queryOptions = handlePagination(pagination, '_id');
    const inventories = await this.inventoryRepository.find({}, {
      skip: queryOptions.offset, limit: queryOptions.limit, sort: { [queryOptions.sort]: queryOptions.order }
    });

    return {
      inventories,
      pagination: {
        total: inventories.length,
        ...pagination,
      }
    }
  }

  async filter(filterInventoryDto: FilterInventoryDto) {
		const { pagination, ...filter } = filterInventoryDto;
		const queryOptions = handlePagination(pagination, '_id');
		const query = {};

    // Apply filters (if any)
    if (filter.product) {
      const { name, category_id, manufacturer_id, tags } = filter.product;
      if (name) query['product.name'] = { $regex: name, $options: 'i' }; // Case-insensitive name filter
      if (category_id) query['product.category'] = category_id;
      if (manufacturer_id) query['product.manufacturer'] = manufacturer_id;
      if (tags && tags.length > 0) query['product.tags'] = { $in: tags };
    }
    if (filter.price !== undefined) query['price'] = filter.price;
    if (filter.sku) query['sku'] = filter.sku;
    if (filter.barcode) query['barcode'] = filter.barcode;
    if (filter.serial) query['serial'] = filter.serial;
    if (filter.stock !== undefined) query['stock'] = filter.stock;


    const inventories = await this.inventoryRepository.find(query, {
      skip: queryOptions.offset, limit: queryOptions.limit, sort: { [queryOptions.sort]: queryOptions.order }
    });

    return {
      inventories,
      pagination: {
        total: inventories.length,
        ...pagination,
      }
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

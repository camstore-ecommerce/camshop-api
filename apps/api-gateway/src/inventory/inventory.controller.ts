import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@app/common/guards';
import { CreateInventoryDto, Inventories, Inventory, UpdateInventoryDto, UpdateReservedStockDto } from '@app/contracts/inventory';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create inventory', description: 'Admin access' })
  @ApiResponse({ status: 201, type: Inventory })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update inventory', description: 'Admin access' })
  @ApiResponse({ status: 200, type: Inventory })
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Get('products/:id')
  @Public()
  @ApiOperation({ summary: 'Find inventory by product', description: 'Public' })
  @ApiResponse({ status: 200, type: Inventory })
  findByProduct(@Param('id') id: string) {
    return this.inventoryService.findByProduct(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Find all inventory', description: 'Public' })
  @ApiResponse({ status: 200, type: Inventories })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Patch('reserve-stock')
  @ApiOperation({ summary: 'Reserve stock', description: 'Public' })
  @ApiResponse({ status: 200, type: Inventory })
  reserveStock(@Body() updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryService.reserveStock(updateReservedStockDto);
  }

  @Patch('release-stock')
  @ApiOperation({ summary: 'Release stock', description: 'Public' })
  @ApiResponse({ status: 200, type: Inventory })
  releaseStock(@Body() updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryService.releaseStock(updateReservedStockDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Find one inventory', description: 'Public' })
  @ApiResponse({ status: 200, type: Inventory })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Delete(':id/permanently')
  @Roles(Role.Admin)
  permanentlyRemove(@Param('id') id: string) {
    return this.inventoryService.permanentlyRemove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '@app/common/guards';
import { CreateInventoryDto, UpdateInventoryDto, UpdateReservedStockDto } from '@app/contracts/inventory';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Get('products/:id')
  @Public()
  findByProduct(@Param('id') id: string) {
    return this.inventoryService.findByProduct(id);
  }

  @Get()
  @Public()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Patch('reserve-stock')
  reserveStock(@Body() updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryService.reserveStock(updateReservedStockDto);
  }

  @Patch('release-stock')
  releaseStock(@Body() updateReservedStockDto: UpdateReservedStockDto) {
    return this.inventoryService.releaseStock(updateReservedStockDto);
  }

  @Get(':id')
  @Public()
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

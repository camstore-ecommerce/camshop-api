import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, Product, Products, UpdateProductDto } from '@app/contracts/products';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Roles(Role.Admin)
	@UseInterceptors(FileInterceptor('image'))
	@ApiResponse({ status: 201, type: Product })
	create(
		@Body() createProductDto: CreateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.create(createProductDto, image);
	}

	@Get()
	@Public()
	@ApiResponse({ status: 201, type: Products })
	findAll() {
		return this.productsService.findAll();
	}

	@Get(':id')
	@Public()
	@ApiResponse({ status: 201, type: Product })
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@UseInterceptors(FileInterceptor('image'))
	@ApiResponse({ status: 201, type: Product })
	update(
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.update(id, updateProductDto, image);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	permanentlyRemove(@Param('id') id: string) {
		return this.productsService.permanentlyRemove(id);
	}
}

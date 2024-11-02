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
import { CreateProductDto, UpdateProductDto } from '@app/contracts/products';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Roles(Role.Admin)
	@UseInterceptors(FileInterceptor('image'))
	create(
		@Body() createProductDto: CreateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.create(createProductDto, image);
	}

	@Get()
	@Public()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(':id')
	@Public()
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@UseInterceptors(FileInterceptor('image'))
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

import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UploadedFile,
	UseGuards,
	Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FilterProductDto, Product, Products, UpdateProductDto } from '@app/contracts/products';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBodyWithSingleFile, ApiDocsPagination } from '@app/common/decorators/swagger-form-data.decorators';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Create a new product', description: 'Admin access' })
	@ApiBodyWithSingleFile(
		'image',
		{
			name: { type: 'string', },
			description: { type: 'string', },
			category_id: { type: 'string', },
			manufacturer_id: { type: 'string', },
			tags: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			attributes: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						key: { type: 'string' },
						value: { type: 'string' },
					},
				}
			},
			image: {
				type: 'string',
				format: 'binary',
			}
		},
		['name', 'category_id', 'manufacturer_id', 'image']

	)
	@ApiResponse({ status: 201, type: Product })
	create(
		@Body() createProductDto: CreateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.create(createProductDto, image);
	}

	@Get()
	@Public()
	@ApiOperation({ summary: 'Get all products', description: 'Public access' })
	@ApiResponse({ status: 201, type: Products })
	@ApiDocsPagination('products')
	findAll(@Query() query: any) {
		return this.productsService.findAll(query);
	}

	@Post('filter')
	@Public()
	@ApiOperation({ summary: 'Filter products', description: 'Public access' })
	@ApiResponse({ status: 201, type: Products })
	@ApiDocsPagination('products')
	filter(@Query() query: any, @Body() filterProductDto: FilterProductDto) {
		return this.productsService.filter({...filterProductDto, pagination: query});
	}


	@Get(':id')
	@Public()
	@ApiOperation({ summary: 'Get a product by id', description: 'Public access' })
	@ApiResponse({ status: 201, type: Product })
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Update a product by id', description: 'Admin access' })
	@ApiBodyWithSingleFile(
		'image',
		{
			name: { type: 'string', },
			description: { type: 'string', },
			category_id: { type: 'string', },
			manufacturer_id: { type: 'string', },
			tags: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
			attributes: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						key: { type: 'string' },
						value: { type: 'string' },
					},
				},
			},
			image: {
				type: 'string',
				format: 'binary',
			}
		},
	)
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
	@ApiOperation({ summary: 'Remove a product by id', description: 'Admin access' })
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Permanently remove a product by id', description: 'Admin access' })
	permanentlyRemove(@Param('id') id: string) {
		return this.productsService.permanentlyRemove(id);
	}
}

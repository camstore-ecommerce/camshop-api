import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@app/contracts/products';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
	constructor(private readonly productsRepository: ProductsRepository) {}

	async create(createProductDto: CreateProductDto) {
		return this.productsRepository.create(createProductDto);
	}

	findAll() {
		return this.productsRepository.find({});
	}

	findOne(_id: string) {
		return this.productsRepository.findOne({ _id });
	}

	update(_id: string, updateProductDto: UpdateProductDto) {
		return this.productsRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateProductDto },
		);
	}

	remove(_id: string) {
		return this.productsRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.productsRepository.findOneAndDelete({ _id });
	}
}

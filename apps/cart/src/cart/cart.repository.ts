import { AbstractMongoRepository } from "@app/common/database";
import { Injectable, Logger } from "@nestjs/common";
import { Cart } from "./schema/cart.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CartRepository extends AbstractMongoRepository<Cart> {
	protected readonly logger = new Logger(CartRepository.name);
	constructor(
		@InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
	) {
		super(cartModel);
	}



}
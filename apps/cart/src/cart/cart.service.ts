import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddToCartDto, Cart, RemoveFromCartDto } from '@app/contracts/cart';
import { PRODUCTS_SERVICE_NAME, Products, ProductsServiceClient } from '@app/contracts/products';
import { USERS_SERVICE_NAME, User, UsersServiceClient } from '@app/contracts/users';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Cart as CartSchema } from './schema/cart.schema';
import { Struct } from '@app/common/interfaces/struct';

@Injectable()
export class CartService implements OnModuleInit {
  private productsServiceClient: ProductsServiceClient;
  private usersServiceClient: UsersServiceClient;

  constructor(
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
    @Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.productsServiceClient =
      this.productsClient.getService<ProductsServiceClient>(PRODUCTS_SERVICE_NAME);
    this.usersServiceClient =
      this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  /**
   * Returns from Cart schema to Cart object 
   * @param cart 
   * @param user 
   * @param products 
   * @returns 
   */
  private toCart(cart: CartSchema, user: User, products: Products) {
    return {
      user,
      items: cart.items.map(item => ({
        product: products.products.find(product => product._id.toString() === item.product_id),
        quantity: item.quantity,
        price: item.price,
        options: Struct.wrap(item.options),
      })),
    }
  }

  async createCart(user_id: string) {
    return await this.cartRepository.create({ user_id, items: [] });
  }

  async addToCart(addToCartDto: AddToCartDto) {
    const { user_id, ...cartDto } = addToCartDto;

    let cart = await this.cartRepository.findOne({ user_id: addToCartDto.user_id });

    const user = await firstValueFrom(this.usersServiceClient.findOne({ id: addToCartDto.user_id }));

    if (!cart && user) {
      cart = await this.createCart(user_id);
    }

    const itemIndex = cart.items.findIndex(item => item.product_id === addToCartDto.product_id);

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += addToCartDto.quantity;
    } else {
      cart.items.push({ ...cartDto });
    }

    await this.cartRepository.findOneAndUpdate({ user_id: cart.user_id }, { items: cart.items });

    const products = await firstValueFrom(this.productsServiceClient.findByIds({ ids: cart.items.map(item => item.product_id) }));

    return this.toCart(cart, user, products);
  }

  async getCart(user_id: string) {
    let cart = await this.cartRepository.findOne({ user_id });

    const user = await firstValueFrom(this.usersServiceClient.findOne({ id: user_id }));

    if (!cart && user) {
      cart = await this.createCart(user_id);
    }

    const products = await firstValueFrom(this.productsServiceClient.findByIds({ ids: cart.items.map(item => item.product_id) }));

    return this.toCart(cart, user, products);
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    const cart = await this.cartRepository.findOne({ user_id: removeFromCartDto.user_id });

    cart.items.filter(item => item.product_id !== removeFromCartDto.product_id);

    await this.cartRepository.findOneAndUpdate({ user_id: cart.user_id }, { items: cart.items });

    const user = await firstValueFrom(this.usersServiceClient.findOne({ id: removeFromCartDto.user_id }));

    const products = await firstValueFrom(this.productsServiceClient.findByIds({ ids: cart.items.map(item => item.product_id) }));

    return this.toCart(cart, user, products);
  }
}

import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, CartServiceController, CartServiceControllerMethods, GetCartDto, RemoveFromCartDto } from '@app/contracts/cart';
import { Struct } from '@app/common/interfaces/struct';

@Controller()
@CartServiceControllerMethods()
export class CartController implements CartServiceController{
  constructor(private readonly cartService: CartService) {}

  async addToCart(addToCartDto: AddToCartDto) {
    addToCartDto.options = Struct.unwrap(addToCartDto.options);
    return await this.cartService.addToCart(addToCartDto);
  }

  async getCart(getCartDto: GetCartDto) {
    return await this.cartService.getCart(getCartDto.user_id);
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    return await this.cartService.removeFromCart(removeFromCartDto);
  }
}

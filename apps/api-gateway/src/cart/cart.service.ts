import { CART_CLIENT } from '@app/common/constants/services';
import { AddToCartDto, CART_SERVICE_NAME, Cart, CartServiceClient, RemoveFromCartDto } from '@app/contracts/cart';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CartDto } from './dto/cart.dto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Struct } from '@app/common/interfaces/struct';

@Injectable()
export class CartService implements OnModuleInit {
  private cartServiceClient: CartServiceClient;

  constructor(
    @Inject(CART_CLIENT) private readonly cartClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.cartServiceClient = this.cartClient.getService<CartServiceClient>(CART_SERVICE_NAME);
  }

  /**
   * Convert Cart to CartDto
   * @param cart 
   */
  private mapCart(cart: Cart): CartDto {
    return {
      user: {
        id: cart.user.id,
        email: cart.user.email,
        phone: cart.user.phone,
        first_name: cart.user.first_name,
        last_name: cart.user.last_name,
      },
      items: cart.items.map((item) => ({
        product: {
          id: item.product._id.toString(),
          name: item.product.name,
          image_url: item.product.image_url,
        },
        quantity: item.quantity,
        price: item.price,
        options: Struct.unwrap(item.options),
      })),
    };
  }

  getCart(user_id: string): Observable<CartDto> {
    return this.cartServiceClient.getCart({ user_id }).pipe(
      map((cart) => this.mapCart(cart)),
      catchError((error) => {
        return throwError(() => new BadRequestException(error.message));
      })
    );
  }

  addToCart(addToCartDto: AddToCartDto) {
    if(addToCartDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    return this.cartServiceClient.addToCart({...addToCartDto, options: Struct.wrap(addToCartDto.options)}).pipe(
      map((cart) => this.mapCart(cart)),
      catchError((error) => {
        return throwError(() => new BadRequestException(error.message));
      })
    );
  }

  removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    return this.cartServiceClient.removeFromCart(removeFromCartDto).pipe(
      map((cart) => this.mapCart(cart)),
      catchError((error) => {
        return throwError(() => new BadRequestException(error.message));
      })
    );
  }
}

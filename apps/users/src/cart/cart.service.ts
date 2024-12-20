import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AddToCartDto, Cart, RemoveFromCartDto } from '@app/contracts/cart';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { PrismaService } from '../prisma.service';
import { INVENTORY_SERVICE_NAME, Inventories, InventoryServiceClient } from '@app/contracts/inventory';
import { Prisma } from '@prisma/client';

type CartWithRelations = Prisma.CartGetPayload<{
  include: { cart_items: true; user: true };
}>;

@Injectable()
export class CartService implements OnModuleInit {
  private invetoryServiceClient: InventoryServiceClient;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.invetoryServiceClient =
      this.productsClient.getService<InventoryServiceClient>(INVENTORY_SERVICE_NAME);
  }

  /**
   * Returns from Cart schema to Cart object 
   * @param cart 
   * @param user 
   * @param products 
   * @returns 
   */
  private toCart(cart: CartWithRelations, inventories: Inventories): Cart {
    return {
      user: cart.user,
      items: cart.cart_items.map(item => ({
        inventory: inventories.inventories.find(inventory => inventory.id === item.inventory_id),
        quantity: item.quantity,
      })),
    }
  }

  async addToCart(addToCartDto: AddToCartDto) {
    try {
      await this.prismaService.user.findUniqueOrThrow({ where: { id: addToCartDto.user_id } });

      const { user_id, ...cartDto } = addToCartDto;

      await this.prismaService.cartItem.upsert({
        where: {
          user_id_inventory_id: {
            user_id,
            inventory_id: cartDto.inventory_id
          }
        },
        update: {
          quantity: cartDto.quantity
        },
        create: {
          user_id,
          inventory_id: cartDto.inventory_id,
          quantity: cartDto.quantity
        }
      });

      const cart = await this.prismaService.cart.findUnique({
        where: { user_id },
        include: {
          cart_items: true,
          user: true
        }
      });

      const inventories = await firstValueFrom(
        this.invetoryServiceClient.findByIds({ ids: cart.cart_items.map(item => item.inventory_id) })
      );

      return this.toCart(cart, inventories);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getCart(user_id: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id },
      include: {
        cart_items: true,
        user: true
      }
    });

    const inventories = await firstValueFrom(
      this.invetoryServiceClient.findByIds({ ids: cart.cart_items.map(item => item.inventory_id) })
    );

    return this.toCart(cart, inventories);
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto) {
    try {
      await this.prismaService.cartItem.delete({
        where: {
          user_id_inventory_id: {
            user_id: removeFromCartDto.user_id,
            inventory_id: removeFromCartDto.inventory_id
          }
        }
      });

      const cart = await this.prismaService.cart.findUnique(
        {
          where: { user_id: removeFromCartDto.user_id },
          include: { cart_items: true, user: true }
        });
      const inventories = await firstValueFrom(
        this.invetoryServiceClient.findByIds({ ids: cart.cart_items.map(item => item.inventory_id) })
      );

      return this.toCart(cart, inventories);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

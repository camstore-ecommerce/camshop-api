import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { UserDto } from '@app/contracts/users';
import { AddToCartDto, RemoveFromCartDto } from '@app/contracts/cart';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Add to cart', description: 'Add product to cart. User Access' })
  @ApiResponse({ status: 200, type: CartDto })
  addToCart(@AuthUser() user: UserDto, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart({...addToCartDto, user_id: user.id});
  }

  @Get()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Get cart', description: 'Get user cart. User Access' })
  @ApiResponse({ status: 200, type: CartDto })
  getCart(@AuthUser() user: UserDto) {
    return this.cartService.getCart(user.id);
  }

  @Post('remove')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Remove from cart', description: 'Remove product from cart. User Access' })
  @ApiResponse({ status: 200, type: CartDto })
  removeFromCart(@AuthUser() user: UserDto, @Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart({...removeFromCartDto, user_id: user.id});
  }
}

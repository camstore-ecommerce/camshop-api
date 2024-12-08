// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/cart/cart.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { User } from "../users";
import { Product } from "../products";
import { AddToCartDto, RemoveFromCartDto } from ".";

export const protobufPackage = "cart";

export interface GetCartDto {
  user_id: string;
}

export interface Cart {
  user: User;
  items: CartItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export const CART_PACKAGE_NAME = "cart";

export interface CartServiceClient {
  addToCart(request: AddToCartDto): Observable<Cart>;

  getCart(request: GetCartDto): Observable<Cart>;

  removeFromCart(request: RemoveFromCartDto): Observable<Cart>;
}

export interface CartServiceController {
  addToCart(request: AddToCartDto): Promise<Cart> | Observable<Cart> | Cart;

  getCart(request: GetCartDto): Promise<Cart> | Observable<Cart> | Cart;

  removeFromCart(request: RemoveFromCartDto): Promise<Cart> | Observable<Cart> | Cart;
}

export function CartServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addToCart", "getCart", "removeFromCart"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CartService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CartService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CART_SERVICE_NAME = "CartService";

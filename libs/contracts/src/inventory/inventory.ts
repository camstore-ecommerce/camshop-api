// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/products/inventory.proto

/* eslint-disable */
import { Empty, Pagination } from "@app/common/interfaces";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CreateInventoryDto, Inventories, Inventory, UpdateInventoryDto, UpdateReservedStockDto } from ".";
import { FilterInventoryDto } from "./filter-inventory.dto";

export const protobufPackage = "products";

export interface InventoryId {
  id: string;
}

export interface FindByIdsDto {
	ids: string[];
}

export const PRODUCTS_PACKAGE_NAME = 'products';

export interface InventoryServiceClient {
  create(request: CreateInventoryDto): Observable<Inventory>;

  update(request: UpdateInventoryDto): Observable<Inventory>;

  findAll(request: Pagination): Observable<Inventories>;

  filter(request: FilterInventoryDto): Observable<Inventories>;

  findByIds(request: FindByIdsDto): Observable<Inventories>;

  findOne(request: InventoryId): Observable<Inventory>;

  remove(request: InventoryId): Observable<Empty>;

  permanentlyRemove(request: InventoryId): Observable<Empty>;

  reserveStock(request: UpdateReservedStockDto): Observable<Inventory>;

  releaseStock(request: UpdateReservedStockDto): Observable<Inventory>;
}

export interface InventoryServiceController {
  create(request: CreateInventoryDto): Promise<Inventory> | Observable<Inventory> | Inventory;

  update(request: UpdateInventoryDto): Promise<Inventory> | Observable<Inventory> | Inventory;

  findAll(request: Pagination): Promise<Inventories> | Observable<Inventories> | Inventories;

  filter(request: FilterInventoryDto): Promise<Inventories> | Observable<Inventories> | Inventories;

  findOne(request: InventoryId): Promise<Inventory> | Observable<Inventory> | Inventory;

  findByIds(request: FindByIdsDto): Promise<Inventories> | Observable<Inventories> | Inventories

  remove(request: InventoryId): Promise<Empty> | Observable<Empty> | Empty;

  permanentlyRemove(request: InventoryId): Promise<Empty> | Observable<Empty> | Empty;

  reserveStock(request: UpdateReservedStockDto): Promise<Inventory> | Observable<Inventory> | Inventory;

  releaseStock(request: UpdateReservedStockDto): Promise<Inventory> | Observable<Inventory> | Inventory;
}

export function InventoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "create",
      "update",
      "findAll",
      "findByIds",
      "filter",
      "findOne",
      "remove",
      "permanentlyRemove",
      "reserveStock",
      "releaseStock",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("InventoryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("InventoryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const INVENTORY_SERVICE_NAME = "InventoryService";

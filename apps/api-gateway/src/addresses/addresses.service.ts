import { USERS_CLIENT } from '@app/common/constants/services';
import { ADDRESSES_SERVICE_NAME, AddressesServiceClient, CreateAddressDto, FindOneAddressDto, RemoveAddressDto, UpdateAddressDto } from '@app/contracts/addresses';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AddressesService implements OnModuleInit {
  private addressesServiceClient: AddressesServiceClient;

  constructor(@Inject(USERS_CLIENT) private readonly addressesClient: ClientGrpc) { }

  onModuleInit() {
    this.addressesServiceClient =
      this.addressesClient.getService<AddressesServiceClient>(ADDRESSES_SERVICE_NAME);
  }

  create(createAddressDto: CreateAddressDto, user_id: string) {
    return this.addressesServiceClient.create({...createAddressDto, user_id});
  }

  findAll(user_id: string) {
    return this.addressesServiceClient.findAll({user_id});
  }

  findOne(id: string, user_id: string) {
    return this.addressesServiceClient.findOne({id, user_id});
  }

  update(id: string, updateAddressDto: UpdateAddressDto, user_id: string) {
    return this.addressesServiceClient.update({...updateAddressDto, id, user_id});
  }

  remove(id: string, user_id: string) {
    return this.addressesServiceClient.remove({id, user_id});
  }
}

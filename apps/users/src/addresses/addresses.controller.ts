import { Controller } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address, Addresses, AddressesServiceController, AddressesServiceControllerMethods, CreateAddressDto, FindAllAddressDto, FindOneAddressDto, RemoveAddressDto, UpdateAddressDto } from '@app/contracts/addresses';

@Controller()
@AddressesServiceControllerMethods()
export class AddressesController implements AddressesServiceController {
  constructor(private readonly addressesService: AddressesService) { }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return await this.addressesService.create(createAddressDto);
  }

  async findAll(findAllAddressDto: FindAllAddressDto): Promise<Addresses> {
    return await this.addressesService.findAll(findAllAddressDto.user_id);
  }

  async findOne(findOneAddressDto: FindOneAddressDto): Promise<Address> {
    return await this.addressesService.findOne(findOneAddressDto.id, findOneAddressDto.user_id);
  }

  async update(updateAddressDto: UpdateAddressDto): Promise<Address> {
    return await this.addressesService.update(updateAddressDto.id, updateAddressDto, updateAddressDto.user_id);
  }

  async remove(removeAddressDto: RemoveAddressDto) {
    return await this.addressesService.remove(removeAddressDto.id, removeAddressDto.user_id);
  }
}

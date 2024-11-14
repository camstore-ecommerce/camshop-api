import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from '@app/contracts/addresses';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser, Roles } from '@app/common/decorators';
import { UserDto } from '@app/contracts/users';
import { Role } from '@app/common/enums';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Post()
  @Roles(Role.User)
  create(@Body() createAddressDto: CreateAddressDto, @AuthUser() user: UserDto) {
    return this.addressesService.create(createAddressDto, user.id);
  }

  @Get()
  @Roles(Role.User)
  findAll(@AuthUser() user: UserDto) {
    return this.addressesService.findAll(user.id);
  }

  @Get(':id')
  @Roles(Role.User)
  findOne(@Param('id') id: string, @AuthUser() user: UserDto) {
    return this.addressesService.findOne(id, user.id);
  }

  @Patch(':id')
  @Roles(Role.User)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @AuthUser() user: UserDto) {
    return this.addressesService.update(id, updateAddressDto, user.id);
  }

  @Delete(':id')
  @Roles(Role.User)
  remove(@Param('id') id: string, @AuthUser() user: UserDto) {
    return this.addressesService.remove(id, user.id);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAddressDto, UpdateAddressDto } from '@app/contracts/addresses';

@Injectable()
export class AddressesService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createAddressDto: CreateAddressDto) {
        return await this.prismaService.userAddress.create({ data: createAddressDto });
    }

    async findAll(user_id: string) {
        const [addresses] = await Promise.all([
            this.prismaService.userAddress.findMany({
                where: { user_id },
                include: { user: true }
            }),]);

        return { count: addresses.length, addresses };
    }

    async findOne(id: string, user_id: string) {
        return await this.prismaService.userAddress.findUnique({ where: { id, user_id } });
    }

    async update(id: string, updateAddressDto: UpdateAddressDto, user_id: string) {
        return await this.prismaService.userAddress.update({ where: { id, user_id }, data: updateAddressDto });
    }

    async remove(id: string, user_id: string) {
        return await this.prismaService.userAddress.delete({ where: { id, user_id } });
    }
}

import { UpdateUserDto } from '@app/contracts/users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto } from '@app/contracts/auth';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	// async create(createUserDto: CreateUserDto) {
	// 	return await this.prismaService.user.create({
	// 		data: {
	// 			...createUserDto,
	// 			password: await bcrypt.hash(createUserDto.password, 10),
	// 		},
	// 	});
	// }

	async findAll() {
		const [users, count] = await Promise.all([
			this.prismaService.user.findMany({ where: { deleted_at: null } }),
			this.prismaService.user.count(),
		]);

		const usersWithoutPassword = users.map(({ password, ...user }) => user);

		return { count, users: usersWithoutPassword };
	}

	async findOne(id: string) {
		return await this.prismaService.user.findFirstOrThrow({
			where: { OR: [{ id }, { email: id }] },
		});
	}

	async findAdmin(id: string) {
		return await this.prismaService.admin.findUniqueOrThrow({ where: { id } });
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		return await this.prismaService.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	async remove(id: string) {
		return await this.prismaService.user.update({
			where: { id },
			data: { deleted_at: new Date() },
		});
	}

	async permanentlyRemove(id: string) {
		return await this.prismaService.user.delete({ where: { id } });
	}

	async validateUser(email: string, password: string) {
		const user = await this.prismaService.user.findUnique({ where: { email } });
		if (!user) {
			return null;
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			throw new UnauthorizedException('Credentials are invalid');
		}

		const { password: _, created_at, updated_at, deleted_at, ...result } = user;

		return result;
	}

	async registerUser(registerDto: UserRegisterDto) {
		const user = await this.prismaService.user.create({
			data: {
				...registerDto,
				password: await bcrypt.hash(registerDto.password, 10),
			},
		});
		const { password, created_at, updated_at, deleted_at, ...result } = user;
		return result;
	}

	async validateAdmin(username: string, password: string) {
		const user = await this.prismaService.admin.findUnique({
			where: { username },
		});
		if (!user || user.role !== 'admin') {
			return null;
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			throw new UnauthorizedException('Credentials are invalid');
		}

		const { password: _, ...result } = user;

		return result;
	}
}

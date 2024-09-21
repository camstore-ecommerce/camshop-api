import { USERS_CLIENT } from '@app/common/constants/services';
import {
	CreateUserDto,
	UpdateUserDto,
	USERS_PATTERNS,
} from '@app/contracts/users';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
	constructor(
		@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
	) {}

	create(createUserDto: CreateUserDto) {
		return this.usersClient.send(USERS_PATTERNS.CREATE, createUserDto);
	}

	findAll() {
		return this.usersClient.send(USERS_PATTERNS.FIND_ALL, {});
	}

	findOne(id: string) {
		return this.usersClient.send(USERS_PATTERNS.FIND_ONE, id);
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.usersClient.send(USERS_PATTERNS.UPDATE, {
			id,
			...updateUserDto,
		});
	}

	remove(id: string) {
		return this.usersClient.send(USERS_PATTERNS.REMOVE, id);
	}

	permanentlyRemove(id: string) {
		return this.usersClient.send(USERS_PATTERNS.PERMANENTLY_REMOVE, id);
	}
}

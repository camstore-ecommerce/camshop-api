import { USERS_CLIENT } from '@app/common/constants/services';
import { UpdateUserDto, USERS_SERVICE_NAME, UsersServiceClient } from '@app/contracts/users';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
	private usersServiceClient: UsersServiceClient;

	constructor(
		@Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.usersServiceClient = this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
	}

	// create(createUserDto: CreateUserDto) {
	// 	return this.usersClient.send(USERS_PATTERNS.CREATE, createUserDto);
	// }

	findAll() {
		return this.usersServiceClient.findAll({});
	}

	findOne(id: string) {
		return this.usersServiceClient.findOne({id});
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.usersServiceClient.update({
			id,
			...updateUserDto,
		});
	}

	remove(id: string) {
		return this.usersServiceClient.remove({id});
	}

	permanentlyRemove(id: string) {
		return this.usersServiceClient.permanentlyRemove({id});
	}
}

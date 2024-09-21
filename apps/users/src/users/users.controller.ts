import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
	CreateUserDto,
	UpdateUserDto,
	USERS_PATTERNS,
} from '@app/contracts/users';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@MessagePattern(USERS_PATTERNS.CREATE)
	create(@Payload() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@MessagePattern(USERS_PATTERNS.FIND_ALL)
	findAll() {
		return this.usersService.findAll();
	}

	@MessagePattern(USERS_PATTERNS.FIND_ONE)
	findOne(@Payload() id: string) {
		return this.usersService.findOne(id);
	}

	@MessagePattern(USERS_PATTERNS.UPDATE)
	update(@Payload() updateUserDto: UpdateUserDto) {
		return this.usersService.update(updateUserDto.id, updateUserDto);
	}

	@MessagePattern(USERS_PATTERNS.REMOVE)
	remove(@Payload() id: string) {
		return this.usersService.remove(id);
	}

	@MessagePattern(USERS_PATTERNS.PERMANENTLY_REMOVE)
	permanentlyRemove(@Payload() id: string) {
		return this.usersService.permanentlyRemove(id);
	}

	@MessagePattern(USERS_PATTERNS.VALIDATE_USER)
	validateUser(@Payload() { email, password }) {
		return this.usersService.validateUser(email, password);
	}
}

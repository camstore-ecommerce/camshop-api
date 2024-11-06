import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
	FindOneUserDto,
	PermanentlyRemoveUserDto,
	RemoveUserDto,
	UpdateUserDto,
	UsersServiceController,
	UsersServiceControllerMethods,
} from '@app/contracts/users';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
	constructor(private readonly usersService: UsersService) {}

	// @MessagePattern(USERS_PATTERNS.CREATE)
	// create(createUserDto: CreateUserDto) {
	// 	return this.usersService.create(createUserDto);
	// }

	findAll() {
		return this.usersService.findAll();
	}

	findOne(findOneUserDto: FindOneUserDto) {
		return this.usersService.findOne(findOneUserDto.id);
	}

	update(updateUserDto: UpdateUserDto) {
		return this.usersService.update(updateUserDto.id, updateUserDto);
	}

	remove(removeUserDto: RemoveUserDto) {
		return this.usersService.remove(removeUserDto.id);
	}

	permanentlyRemove(permanentlyRemoveUserDto: PermanentlyRemoveUserDto) {
		return this.usersService.permanentlyRemove(permanentlyRemoveUserDto.id);
	}

	validateUser({ email, password }) {
		return this.usersService.validateUser(email, password);
	}
}

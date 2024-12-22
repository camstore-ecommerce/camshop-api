import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
	FindOneUserDto,
	FindUsersByIds,
	PermanentlyRemoveUserDto,
	RemoveUserDto,
	UpdateUserDto,
	Users,
	UsersServiceController,
	UsersServiceControllerMethods,
} from '@app/contracts/users';
import { Observable } from 'rxjs';

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

	async findByIds(findUsersByIds: FindUsersByIds) {
		return await this.usersService.findByIds(findUsersByIds.ids);
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

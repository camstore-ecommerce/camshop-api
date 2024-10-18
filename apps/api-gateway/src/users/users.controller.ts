import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from '@app/contracts/users';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { AuthUser, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Roles(Role.Admin)
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Roles(Role.Admin)
	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Roles(Role.Admin)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@AuthUser() user: UserDto,
	) {
		if (user.id !== id && user.role !== 'admin') {
			throw new Error('You can only update your own profile');
		}
		return this.userService.update(id, updateUserDto);
	}

	@Roles(Role.Admin)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}

	@Roles(Role.Admin)
	@Delete(':id/permanently')
	permanentlyRemove(@Param('id') id: string) {
		return this.userService.permanentlyRemove(id);
	}
}

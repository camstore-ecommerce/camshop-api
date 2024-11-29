import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, User, UserDto, Users } from '@app/contracts/users';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { AuthUser, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	// @Roles(Role.Admin)
	// @Post()
	// create(@Body() createUserDto: CreateUserDto) {
	// 	return this.userService.create(createUserDto);
	// }

	@Roles(Role.Admin)
	@Get()
	@ApiOperation({ summary: 'Get all users', description: 'Admin access' })
	@ApiResponse({ status: 200, description: 'All users', type: Users })
	findAll() {
		return this.userService.findAll();
	}

	@Roles(Role.Admin)
	@Get(':id')
	@ApiOperation({ summary: 'Get user by id', description: 'Admin access' })
	@ApiResponse({ status: 200, description: 'User by id', type: User })
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Update user by id', description: 'Only admin can update other users' })
	@ApiResponse({ status: 200, description: 'User updated', type: User })
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(id, updateUserDto);
	}

	@Roles(Role.Admin)
	@Delete(':id')
	@ApiOperation({ summary: 'Remove user by id', description: 'Admin access' })
	@ApiResponse({ status: 200, description: 'User removed', type: User })
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}

	@Roles(Role.Admin)
	@Delete(':id/permanently')
	@ApiOperation({ summary: 'Permanently remove user by id', description: 'Admin access' })
	permanentlyRemove(@Param('id') id: string) {
		return this.userService.permanentlyRemove(id);
	}
}

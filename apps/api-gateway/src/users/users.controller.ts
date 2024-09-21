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
import { CreateUserDto, UpdateUserDto } from '@app/contracts/users';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { Roles } from '@app/common/decorators';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}
	
	@Roles('admin')
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
	
	
	@Roles('admin')
	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Roles('admin')
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Roles('admin')
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Roles('admin')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}

	@Roles('admin')
	@Delete(':id/permanently')
	permanentlyRemove(@Param('id') id: string) {
		return this.userService.permanentlyRemove(id);
	}
}

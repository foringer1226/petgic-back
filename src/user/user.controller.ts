import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';
import { USER_ROLES } from 'src/constants/user/userConstants';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[] | void> {
    return this.userService.getAll();
  }

  @Get('self')
  getSelf(@Session() session: Record<string, any>): Promise<User | void> {
    if (session.user_id) return this.userService.getById(session.user_id);
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ): Promise<User | void> {
    const role = await this.userService.getRole(session.user_id);
    if (role !== USER_ROLES.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.userService.create(createUserDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  register(@Body() registerUserDto: RegisterUserDto): Promise<User | void> {
    return this.userService.create({
      ...registerUserDto,
      role: USER_ROLES.USER,
    });
  }

  @Delete(':id')
  async removeUser(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ): Promise<User | void> {
    const role = await this.userService.getRole(session.user_id);
    if (role !== USER_ROLES.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.userService.remove(id);
  }

  @Put(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ): Promise<User | void> {
    const role = await this.userService.getRole(session.user_id);
    if (updateUserDto.role && role !== USER_ROLES.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (id !== session.user_id && role !== USER_ROLES.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.userService.update(id, updateUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Session() session: Record<string, any>,
  ): Promise<User | void> {
    const user = await this.userService.validateUser(loginUserDto);
    if (user) {
      session.user_id = user._id;
      return user;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>): Promise<User | void> {
    if (session.user_id) {
      session.user_id = undefined;
      throw new HttpException('Ok', HttpStatus.OK);
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}

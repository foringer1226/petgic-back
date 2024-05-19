import { Injectable } from '@nestjs/common';
import { logger } from './user.module';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SALT_LENGTH } from 'src/constants/user/userConstants';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[] | void> {
    return this.userModel
      .find()
      .catch((err) => logger.error('Service.getAll', err));
  }

  async getById(id: string): Promise<User | void> {
    return this.userModel
      .findById(id)
      .catch((err) => logger.error('Service.getById', err));
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getRole(id: string): Promise<string | void> {
    try {
      const user = await this.userModel.findById(id);
      return user.role;
    } catch (err) {
      return logger.error('Service.getRole', err);
    }
  }

  async create(userDto: CreateUserDto): Promise<User | void> {
    try {
      const hashedPassword = await hash(userDto.password, SALT_LENGTH);
      const newUser = new this.userModel({
        ...userDto,
        password: hashedPassword,
      });
      return newUser.save();
    } catch (err) {
      logger.error('Service.create', err);
    }
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument | void> {
    try {
      const user = await this.getByEmail(loginUserDto.email);
      const match = await compare(loginUserDto.password, user.password);
      if (!match) {
        return null;
      }
      return user;
    } catch (err) {
      logger.error('Service.validateUser', err);
    }
  }

  async remove(id: string): Promise<User | void> {
    return this.userModel
      .findByIdAndRemove(id)
      .catch((err) => logger.error('Service.remove', err));
  }

  async update(id: string, userDto: UpdateUserDto): Promise<User | void> {
    try {
      if (userDto.password) {
        userDto.password = await hash(userDto.password, SALT_LENGTH);
      }
      return this.userModel.findByIdAndUpdate(id, userDto, { new: true });
    } catch (err) {
      logger.error('Service.update', err);
    }
  }
}

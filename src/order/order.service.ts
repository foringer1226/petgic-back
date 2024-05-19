import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from '../schemas/order.schema';
import { logger } from './order.module';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(orderDto: CreateOrderDto): Promise<Order | void> {
    const newOrder = new this.orderModel(orderDto);
    return newOrder.save().catch((err) => logger.error('Service.create', err));
  }
}

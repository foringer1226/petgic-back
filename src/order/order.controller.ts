import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '../schemas/order.schema';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Session() session: Record<string, any>,
  ): Promise<Order | void> {
    return this.orderService.create({
      user_id: session.user_id,
      ...createOrderDto,
    });
  }
}

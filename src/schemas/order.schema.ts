import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  fullName: string;

  @Prop()
  petName: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  date: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

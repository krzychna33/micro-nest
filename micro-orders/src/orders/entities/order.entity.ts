import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  productsIds: ObjectId[];

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

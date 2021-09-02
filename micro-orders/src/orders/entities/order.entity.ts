import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema()
export class Order {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop()
  productsIds: ObjectId[];

  @Prop()
  totalPrice: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

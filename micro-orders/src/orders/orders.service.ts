import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  GetUserDtoRequest,
  GetUserDtoResponse,
} from '../shared/services-definitions/users-service/dto/get-user.dto';
import { GetProductDtoResponse } from '../shared/services-definitions/products-service/dto/get-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const userObservable = this.productsClient
      .send<GetUserDtoResponse, GetUserDtoRequest>(
        { cmd: 'get-user' },
        { id: createOrderDto.userId },
      )
      .pipe(timeout(1000));

    const user = await firstValueFrom(userObservable);
    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }

    const products = await this.getProductsByIds(createOrderDto.productsIds);
    this.validateProducts(products);

    const totalPrice = this.getTotalPrice(products);

    const newOrder = new this.orderModel({
      userId: createOrderDto.userId,
      productsIds: createOrderDto.productsIds,
      totalPrice,
    });

    await this.decreaseProductsAmounts(createOrderDto.productsIds);
    return newOrder.save();
  }

  async getProductsByIds(
    productsIds: string[],
  ): Promise<GetProductDtoResponse[]> {
    const promises = productsIds.map<Promise<GetProductDtoResponse>>(
      (productId) => {
        const productsObservable = this.productsClient
          .send<GetProductDtoResponse, GetUserDtoRequest>(
            { cmd: 'get-product' },
            { id: productId },
          )
          .pipe(timeout(1000));

        return firstValueFrom(productsObservable);
      },
    );

    return Promise.all(promises);
  }

  validateProducts(products: GetProductDtoResponse[]) {
    products.forEach((product) => {
      if (product.amountAvailable <= 0) {
        throw new BadRequestException(`${product.name} is not available`);
      }
    });
  }

  getTotalPrice(products: GetProductDtoResponse[]): number {
    return products.reduce((total, product) => {
      return total + product.price;
    }, 0);
  }

  decreaseProductsAmounts(productsIds: string[]) {
    const promises = productsIds.map<Promise<GetProductDtoResponse>>(
      (productId) => {
        const decreaseProductAmountObservable = this.productsClient
          .send(
            { cmd: 'decrease-product-amount' },
            {
              id: productId,
            },
          )
          .pipe(timeout(1000));

        return firstValueFrom(decreaseProductAmountObservable);
      },
    );

    return Promise.all(promises);
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }
}

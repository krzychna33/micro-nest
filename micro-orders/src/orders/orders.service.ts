import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  GetUserDtoRequest,
  GetUserDtoResponse,
} from '../shared/services-definitions/users-service/dto/get-user.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const userObservable = this.usersClient
      .send<GetUserDtoResponse, GetUserDtoRequest>(
        { cmd: 'get-user' },
        { id: createOrderDto.userId },
      )
      .pipe(timeout(1000));
    const user = await firstValueFrom(userObservable);
    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }

    console.log(user);

    const productsObservable = this.productsClient
      .send<any, any>(
        { cmd: 'get-product' },
        { id: createOrderDto.productsIds[0] },
      )
      .pipe(timeout(1000));

    const product = await firstValueFrom(productsObservable);
    console.log(product);

    return user;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

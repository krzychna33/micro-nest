import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Context } from 'vm';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'get-product' })
  mGetOne(@Payload('id') id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'decrease-product-amount' })
  mDecreaseProductAmount(@Payload('id') id: string, @Ctx() context: Context) {
    console.log(context);
    return this.productsService.decreaseAmount(id);
  }
}

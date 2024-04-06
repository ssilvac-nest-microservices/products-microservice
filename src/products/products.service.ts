import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        page,
        limit,
        total,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.findOne(updateProductDto.id); // check if product exists, if not throw error

    return this.product.update({
      where: { id: updateProductDto.id },
      data: updateProductDto,
    });
  }

  // implement softdelete
  async remove(id: number) {
    await this.findOne(id); // check if product exists, if not throw error

    return this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
}

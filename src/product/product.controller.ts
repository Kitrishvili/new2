import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?:string){
    return this.productService.getAll(searchTerm)
  }

  @Get('by-storeId/:storeId')
  async getByStoreId(
    @Param('storeId') storeId:string){
    return this.productService.getByStoreId(storeId)
  }

  @Get('by-id/:id')
  async getById(
    @Param('id') id:string){
    return this.productService.getById(id)
  }

  @Get('by-id/:id')
  async getByCategoryId(
    @Param('categoryId') categoryId:string){
    return this.productService.getByCategoryId(categoryId)
  }


  @Get('getMostPopular')
  async getMostPopular(){
    return this.productService.getMostPopular()
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id:string){
    return this.productService.getSimilar(id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('by-storeId/:storeId')
  async create(
    @Param('storeId') storeId:string,
    @Body() dto:ProductDto
  ){
    return this.productService.create(storeId, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('by-id/:id')
  async update(
    @Param('id') id:string,
    @Body() dto:ProductDto
  ){
    return this.productService.update(id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete('by-id/:id')
  async delete(
    @Param('id') id:string
  ){
    return this.productService.delete(id)
  }
}

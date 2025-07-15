import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes } from '@nestjs/common';
import { StoreService } from './store.service';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { ValidationPipe } from '@nestjs/common';
import { createStoreDto } from './dto/createStore.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') storeId:string,
    @CurrentUser('id') userId:string
  ){
    return this.storeService.getById(storeId, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(
    @CurrentUser('id') userId:string,
    @Body() dto:createStoreDto
  ){
    return this.storeService.create(userId, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('by-id/:id')
  async update(
    @Param('id') storeId:string,
    @CurrentUser('id') userId:string,
    @Body() dto:UpdateStoreDto
  ){
    return this.storeService.update(storeId, userId, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete('by-id/:id')
  async delete(
    @Param('id') storeId:string,
    @CurrentUser('id') userId:string
  ){
    return this.storeService.delete(storeId, userId)
  }
}

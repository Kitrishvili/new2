import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { ValidationPipe } from '@nestjs/common';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ColorService } from './color.service';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(
    @Param('storeId') storeId:string,
  ){
    return this.colorService.getByStoreId(storeId)
  }

  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') id:string,
  ){
    return this.colorService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('by-storeId/:storeId')
  async create(
    @Param('storeId') storeId:string,
    @Body() dto:ColorDto
  ){
    return this.colorService.create(storeId, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('by-id/:id')
  async update(
    @Param('id') id:string,
    @Body() dto:ColorDto
  ){
    return this.colorService.update(id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete('by-id/:id')
  async delete(
    @Param('id') id:string
  ){
    return this.colorService.delete(id)
  }
}

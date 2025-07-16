import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(
    @Param('storeId') storeId:string,
  ){
    return this.reviewService.getByStoreId(storeId)
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('by-storeProductId/:storeId/:productId')
  async create(
    @CurrentUser('id') userId:string,
    @Param('storeId') storeId:string,
    @Param('productId') productId:string,
    @Body() dto:ReviewDto
  ){
    return this.reviewService.create(userId, productId, storeId, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete('by-id/:id')
  async delete(
    @Param('id') id:string,
    @CurrentUser('id') userId: string
  ){
    return this.reviewService.delete(id, userId)
  }
}

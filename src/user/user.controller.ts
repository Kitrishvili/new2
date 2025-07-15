import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { CurrentUser } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id:string){
    return this.userService.getById(id)
  }

  @Auth()
  @Get('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId:string,
    @Param('productId') productId:string
  ){
    return this.userService.toggleFavorite(productId, userId)
  }
}

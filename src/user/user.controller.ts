import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { currentUser } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  async getProfile(@currentUser('id') id:string){
    return this.userService.getById(id)
  }

  @Auth()
  @Get('profile/favorites/:productId')
  async toggleFavorite(
    @currentUser('id') userId:string,
    @Param('productId') productId:string
  ){
    return this.userService.toggleFavorite(productId, userId)
  }
}

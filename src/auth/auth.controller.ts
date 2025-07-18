import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { PassThrough } from 'stream';
import { Request, response, Response } from 'express';
import { error } from 'console';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({passthrough:true}) res: Response){
    const {refreshToken, ...response} = await this.authService.login(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)
  
    return response
  } 

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({passthrough:true}) res: Response){

    const {refreshToken, ...response} = await this.authService.register(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Req() req: Request, @Res({passthrough:true}) res: Response){

    
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]
    
    if(!refreshTokenFromCookies){
      this.authService.removeRefreshTokenFromResponse(res)
      throw new UnauthorizedException("refresh token haven't passed")
    }
    
    const {refreshToken, ...response} = await this.authService.getNewTokens(refreshTokenFromCookies)
    this.authService.addRefreshTokenToResponse(res, refreshToken)


    return response
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({passthrough:true}) res: Response){
    this.authService.removeRefreshTokenFromResponse(res)
    return true
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req){

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res({passthrough:true}) res:Response){
    const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    console.log('acces' + response.accessToken, 'refresh' + refreshToken)

    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken${response.accessToken}`
    )
  }

}

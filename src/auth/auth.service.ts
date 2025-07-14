import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/app.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { NotFoundError, retry } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
    EXPIRES_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshtoken'

    constructor(
        private jwt: JwtService,
        private userService: UserService,
        private prisma: PrismaService,
        private configService: ConfigService
    ){}

    async login (dto: AuthDto){
        const user = await this.validateUser(dto)
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    async register (dto: AuthDto){
        const oldUser = await this.userService.getByEmail(dto.email)

        if (oldUser) {
            throw new BadRequestException('user already exist')
        }

        const user = await this.userService.create(dto)
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens}
    }
    async getNewTokens(refreshToken: string){
        const result = await this.jwt.verifyAsync(refreshToken)
        if (!result) throw new UnauthorizedException('non valid refresh token')
        
        const user = await this.userService.getById(result.id)
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens}
    } 

    issueTokens(userId: string){
        const data = {id:userId}

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })


        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })
        
        return { accessToken, refreshToken}

    }
    private async validateUser(dto: AuthDto){
        const user = await this.userService.getByEmail(dto.email)

        if (!user) throw new NotFoundException("user haven't found")
        
        return user
    }
    async validateOAuthLogin(req: any){
        let user = await this.userService.getByEmail(req.email.user)

        if (!user){
            user = await this.prisma.user.create({
                data:{
                    email: req.user.email,
                    name: req.user.name,
                    picture: req.user.picture,
                },
                include:{
                    stores:true,
                    favorites:true,
                    orders:true
                }
            })
        }
        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    addRefreshTokenToResponse(res: Response, refreshToken:string){
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly:true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: expiresIn,
            secure:true,
            sameSite: 'none'
        })
    }
    removeRefreshTokenFromResponse(res: Response){
        res.cookie(this.REFRESH_TOKEN_NAME, {
            httpOnly:true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: new Date(0),
            secure:true,
            sameSite: 'none'
        })
    }
}

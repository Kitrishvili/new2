import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app.service';
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto';
import { truncate } from 'fs';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async getById(id:string){
      
        try {
                const user = await this.prisma.user.findUnique({
        where:{
            id
        },
        include:{
            stores:true,
            favorites:true,
            orders:true
        }
        })

        return user
        } catch (error) {
            return error
        }
    }

    async getByEmail(email:string){
        const user = await this.prisma.user.findUnique({
            where:{
                email
            },
            include:{
                stores:true,
                favorites:true,
                orders:true
            }
        })
        return user
    }

    async toggleFavorite(productId: string, userId:string){
        const user = await this.getById(userId)

        const isExists = user.favorites.some(
            product => product.id === productId
        )

        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                favorites:{
                    [isExists ? 'disconnect' : 'connect']:{
                        id:productId
                    }
                }
            }
            
        })
        return true
    }

    async create (dto:AuthDto){
        return this.prisma.user.create({
            data:{
                name:dto.name,
                email:dto.email,
                password:await hash(dto.password)
            }
        })
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/app.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
    constructor(private prisma: PrismaService){}
    
    async getByStoreId(storeId: string){
            return this.prisma.color.findMany({
                where:{
                    storeId
                },
                include:{

                }
            })
        }
    async getById(id:string){
            const color = await this.prisma.color.findUnique({
                where:{
                    id
                }
            })
    
            if (!color)
                throw new NotFoundException(
                    'color not found'
                )
            return color
        }
    async create(storeId:string, dto:ColorDto){
            return this.prisma.color.create({
                data:{
                    name:dto.name,
                    value:dto.value,
                    storeId
                }
            })
        }
    async update(id:string, dto:ColorDto){
        await this.getById(id)
        
        return this.prisma.color.update({
            where:{ id },
            data:dto
        })
    }
    async delete(id:string){
        await this.getById(id )
        
        return this.prisma.color.delete({
            where:{ id }
        })
    }
    
}

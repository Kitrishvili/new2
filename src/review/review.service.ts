import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/app.service';
import { ProductService } from 'src/product/product.service';
import { ReviewDto } from './dto/review.dto';
import { connect } from 'http2';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService
  ){}

  async getByStoreId(storeId: string){
              return this.prisma.review.findMany({
                  where:{
                      storeId
                  },
                  select:{
                    user:true
                  }
              })
          }
  async getById(id:string, userId: string){
          const review = await this.prisma.review.findUnique({
              where:{
                  id,
                  userId
              },
              include:{
                user:true
              }
          })
  
          if (!review)
              throw new NotFoundException(
                  'review not found or u r not the owner'
              )
          return review
        }

  async create(
    userId:string,
    productId:string,
    storeId:string,
    dto:ReviewDto
  ){
    return this.prisma.review.create({
      data:{
        ...dto,
        Product:{
          connect:{
            id: productId
          }
        },
        user:{
          connect:{
            id: userId
          }
        },
        Store:{
          connect:{
            id: storeId
          }
        }
      }
    })
  }

  async delete(id: string, userId: string){
    await this.getById(id, userId)

    return this.prisma.review.delete({
      where:{
        id
      }
    })
  }
}

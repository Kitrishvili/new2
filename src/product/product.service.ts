import { Injectable, NotFoundException } from '@nestjs/common';
import { strict } from 'assert';
import { PrismaService } from 'src/app.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService){}

    async getAll(searchTerm?:string){
        
        if (searchTerm) return this.getSearhTermFilter(searchTerm)
        
        
        return this.prisma.product.findMany({
            orderBy:{
                createdAt:'desc'
            }, 
            include:{
                Category:true
            }
        })

    }

    private async getSearhTermFilter(searchTerm:string){
        return this.prisma.product.findMany({
            where:{OR:[
                {
                    title:{
                        contains:searchTerm,
                        mode:'insensitive'
                    },
                    description:{
                        contains:searchTerm,
                        mode:'insensitive'
                    }
                }
            ]}
        })
    }

    async getByStoreId(storeId: string){
                return this.prisma.product.findMany({
                    where:{
                        storeId
                    },
                    include:{
                        Category:true,
                        Color:true
                    }
                })
            }
    async getById(id:string){
            const product = await this.prisma.product.findUnique({
                where:{
                    id
                },
                include:{
                    Category:true,
                    Color:true,
                    reviews:true
                }
            })
    
            if (!product)
                throw new NotFoundException(
                    'product not found'
                )
            return product
        }
        async getByCategoryId(categoryId:string){
            const products = await this.prisma.product.findMany({
                where:{
                    Category:{
                        id:categoryId
                    }
                },
                include:{
                    Category:true
                }
            })
    
            if (!products)
                throw new NotFoundException(
                    'product not found'
                )
            return products
        }

        async getMostPopular(){
            const mostPopularProducts = await this.prisma.orderItem.groupBy({
                by:['productId'],
                _count:{
                    id:true
                },
                orderBy:{
                    _count:{
                        id: 'desc'
                    }
                }
            })

            const productIds = mostPopularProducts.map(item => item.productId).filter((id): id is string => !!id) 

            const products = await this.prisma.product.findMany({
                where:{
                    id:{
                        in:productIds
                    }
                },
                include:{
                    Category:true
                }
            })

            return products
        }

        async getSimilar(id:string){
            const currentProduct = await this.getById(id)

            if (!currentProduct)
                throw new NotFoundException("current product isn't found")
            
            const products = await this.prisma.product.findMany({
                where:{
                    Category:{
                        title: currentProduct.Category?.title
                    },
                    NOT:{
                        id:currentProduct.id
                    }
                },
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    Category:true
                }
            })

            return products
        }
    async create(storeId:string, dto:ProductDto){
            return this.prisma.product.create({
                data:{
                    title:dto.title,
                    description:dto.description,
                    price:dto.price,
                    images:dto.images,
                    categoryId:dto.categoryId,
                    colorId:dto.colorId,
                    storeId
                }
            })
        }
    async update(id:string, dto:ProductDto){
        await this.getById(id)
        
        return this.prisma.product.update({
            where:{ id },
            data:dto
        })
    }
    async delete(id:string){
        await this.getById(id )
        
        return this.prisma.product.delete({
            where:{ id }
        })
    }

}
    
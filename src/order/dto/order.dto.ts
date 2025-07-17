import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { EnumOrderStatus } from "generated/prisma";


export class OrderDto {
    @IsOptional()
    @IsEnum(EnumOrderStatus, {
        message:
            'status of order should be one of' +
            Object.values(EnumOrderStatus).join(', ')
    })
    status: EnumOrderStatus

    @IsArray({
        message: 'there is no products in the order'
    })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}

export class OrderItemDto {
    @IsNumber({}, { message: 'quantity should be a number'})
    quantity:number

    @IsNumber({}, { message: 'price should be a number'})
    price:number

    @IsString({ message: 'id of product should be a string'})
    productId:string

    @IsString({ message: 'id of store should be a string'})
    storeId:string
}
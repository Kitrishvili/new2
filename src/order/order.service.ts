import { Injectable, Redirect } from '@nestjs/common';
import { loadStripe } from '@stripe/stripe-js';
import { OrderDto } from './dto/order.dto';
import { PrismaService } from 'src/app.service';
import { connect } from 'http2';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
    private stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

    constructor(private prisma: PrismaService){}

    async createPayment(userId: string, dto:OrderDto){
        const orderItems = dto.items.map(item => ({
            quantity:item.quantity,
            price:item.price,
            Product: {
                connect:{
                    id: item.productId
                }
            },
            Store:{
                connect:{
                    id:item.storeId
                }
            }
        }))
        
        const total = dto.items.reduce((acc, item) => {
            return acc + item.price * item.quantity
        }, 0)

       
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount:total,
            currency:'usd',
            payment_method_types:["card"]
        })

        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                items:{
                    create: orderItems
                },
                total,
                User:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
        return {order, paymentIntent}
    // }
    // const lineItems = dto.items.map(item => ({
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: item.productName, // or fetch from DB
    //         description: item.productDescription, // optional
    //       },
    //       unit_amount: item.price, // in cents
    //     },
    //     quantity: item.quantity,
    //   }));
    // async createStripeSession(userId: string, dto: OrderDto) {
    //     const session = await this.stripe.checkout.sessions.create({
    //       payment_method_types: ['card'],
    //       line_items: this.lineItems,
    //       mode: 'payment',
    //       success_url: 'http://localhost:3000',
    //       cancel_url: 'http://localhost:3000/error',
    //     });
    //     return session;
    }
}

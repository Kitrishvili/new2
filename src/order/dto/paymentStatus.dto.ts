class AmountPayment{
    value:string
    currency:string
}

class ObjectPayment {
    id:string
    status: string
    amount:AmountPayment
    paymentMethod:{
        type:string
        id:string
        saved:boolean
        title:string
        card:object
    }
    createdAt:string
    expiresAt:string
    description:string
}

export class PaymentStatusDto {
    event:
        | 'payment.succeded'
        | 'payment.waitingForCapture'
        | 'payment.canceled'
        | 'refund.succeeded'
    type:string
    object: ObjectPayment
}
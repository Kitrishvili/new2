import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "generated/prisma";
import { createParam } from "generated/prisma/runtime/library";


export const currentUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user

        return data ? user[data] : user
    }
)
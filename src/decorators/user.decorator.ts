import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

export const UserDecorator = createParamDecorator(( filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
        if (filter) {
            return request.user[filter];
        } else {
            return request.user;
        }
    } else {
        throw new NotFoundException("user not found - request decorator")
    }

})
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/db/schemas/user.schema';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

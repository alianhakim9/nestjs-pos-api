import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.body.user = {
      id: req.user.id,
    };
    return req.body;
  },
);

import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const RequestingUserIdPipe = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest()
  return request.user.id
})

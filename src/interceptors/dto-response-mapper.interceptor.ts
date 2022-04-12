import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { isString } from "class-validator"

type DTOClass = { new (): ResponseDTO }
type Config = DTOClass | string

export interface ResponseDTO {
  mapToResponse(data: unknown): object
}

export function ResponseMapper(config: Config) {
  return UseInterceptors(new MapToDTOInterceptor(config))
}

export class MapToDTOInterceptor implements NestInterceptor {
  constructor(private config: Config) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<object> {
    if (isString(this.config)) {
      const dataKey: string = this.config
      return next.handle().pipe(map((data: unknown) => ({ [dataKey]: data })))
    }
    const dto: DTOClass = this.config
    return next.handle().pipe(map((data: unknown) => new dto().mapToResponse(data)))
  }
}

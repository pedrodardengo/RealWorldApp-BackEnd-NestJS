import {CallHandler, ExecutionContext, NestInterceptor, UseInterceptors} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {plainToInstance} from "class-transformer";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function securityWrapper(dto: ClassConstructor) {
    /**
     * This is a decorator for a general serializer. When used with a DTO in its arguments it will remove non-exposed
     *DTO attributes from the incoming data. For example, if an endpoint should return User data, this can be used
     * to remove password and other sensitive information.
     */
    return UseInterceptors(new SecurityInterceptor(dto))
}

export class SecurityInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler<unknown>
    ): Observable<any> {

        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )

    }
}
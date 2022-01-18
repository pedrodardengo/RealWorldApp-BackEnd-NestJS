import {CallHandler, ExecutionContext, NestInterceptor, UseInterceptors} from "@nestjs/common";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";


export function dataWrapper(dataKey: string) {
    /**
     * This is used to pass the intercept this app responses in order to add a wrapper key around the response data.
     */
    return UseInterceptors(new DataWrapperInterceptor(dataKey))
}

export interface Response<T> {
    data: object;
}

export class DataWrapperInterceptor implements NestInterceptor<object, Response<object>> {

    constructor(private dataKey: string) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler<unknown>
    ): Observable<any> {

        return next.handle().pipe(map((data: unknown) => ({[this.dataKey]: data})))

    }
}
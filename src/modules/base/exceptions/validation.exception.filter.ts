import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common'
import { Error } from 'mongoose'

@Catch(Error.ValidationError)
export class ValidationExceptionFilter implements RpcExceptionFilter {
    catch(exception: Error.ValidationError, host: ArgumentsHost): any {
        const ctx = host.switchToHttp(),
            response = ctx.getResponse()

        return response.status(400).json({
            statusCode: 400,
            createdBy: 'ValidationExceptionFilter',
            errors: exception.errors
        })
    }
}


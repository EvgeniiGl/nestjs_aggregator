import {Body, Controller, Post, UseFilters, Query, Get} from '@nestjs/common'
import {PublicRoute} from '@modules/base/decorators/public_route.decorator'
import {Roles} from '@modules/base/decorators/roles.decorator'
import {ValidationExceptionFilter} from '@modules/base/exceptions/validation.exception.filter'
import {SearchUserParams} from './interfaces/user.interface'
import {User} from './models/user.model'
import {UsersService} from './users.service'

@Controller()
export class UsersController {
    constructor(private userService: UsersService) {
    }
    
    @Roles('admin')
    @UseFilters(ValidationExceptionFilter)
    @Post('admin/users')
    async createUser(@Body() body: User) {
        const user = await this.userService.create(body)
        delete body.password
        return {...body, id: user.id}
    }

    @Roles('admin')
    @Get('admin/users')
    async findUsersByAdmin(@Query() params: SearchUserParams) {
        return await this.userService.findAll(params)
    }
    
    @PublicRoute()
    @UseFilters(ValidationExceptionFilter)
    @Post('client/register')
    async clientRegister(@Body() body: User) {
        const user = await this.userService.create({...body, role: 'client'})
        delete body.password
        return {...body, id: user.id}
    }



}

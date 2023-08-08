import {Body, Controller, Post, UseFilters, Query, Get} from '@nestjs/common'
import {PublicRoute} from '@modules/base/decorators/public_route.decorator'
import {Role} from '@modules/base/decorators/role.decorator'
import {ValidationExceptionFilter} from '@modules/base/exceptions/validation.exception.filter'
import {SearchUserParams} from './interfaces/user.interface'
import {User} from './models/user.model'
import {UsersService} from './users.service'
import {Roles} from "@modules/users/models/user.model";

@Controller()
export class UsersController {
    constructor(private userService: UsersService) {
    }
    
    @Role(Roles.ADMIN)
    @UseFilters(ValidationExceptionFilter)
    @Post('admin/users')
    async createUser(@Body() body: User) {
        const user = await this.userService.create(body)
        delete body.password
        return {...body, id: user.id}
    }

    @Role(Roles.ADMIN)
    @Get('admin/users')
    async findUsersByAdmin(@Query() params: SearchUserParams) {
        return await this.userService.findAll(params)
    }

    @Role(Roles.MANAGER)
    @Get('manager/users')
    async findUsersByManager(@Query() params: SearchUserParams) {
        return await this.userService.findAll(params)
    }
    
    @PublicRoute()
    @UseFilters(ValidationExceptionFilter)
    @Post('client/register')
    async clientRegister(@Body() body: User) {
        const user = await this.userService.create({...body, role: Roles.CLIENT})
        delete body.password
        return {...body, id: user.id}
    }
}

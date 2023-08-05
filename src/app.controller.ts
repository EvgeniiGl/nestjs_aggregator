import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common'
import { AppService } from './app.service'
import {LocalAuthGuard} from "@modules/base/guards/loc-auth.guard";
import {PublicRoute} from "@modules/base/decorators/public_route.decorator";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }
    
    @UseGuards(LocalAuthGuard)
    @PublicRoute()
    @Post('signin')
    async signin(@Request() req) {
        const {email, name, contactPhone} = req.session.passport.user
        return {email, name, contactPhone}
    }

    @Post('signout')
    signout(@Request() req) {
        req.session.destroy()
    }
}

import {Controller, Get, Post, Render, Request, UseGuards} from '@nestjs/common'
import {AppService} from './app.service'
import {LocalAuthGuard} from "@modules/base/guards/loc-auth.guard";
import {PublicRoute} from "@modules/base/decorators/public_route.decorator";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @PublicRoute()
    @Render('index')
    root() {
        return {message: 'Hello world!'};
    }

    @UseGuards(LocalAuthGuard)
    @PublicRoute()
    @Post('auth/login')
    async login(@Request() req) {
        const {email, name, contactPhone, role} = req.session.passport.user

        return {email, name, contactPhone, role}
    }

    @Post('auth/logout')
    logout(@Request() req) {
        req.session.destroy()
    }
}

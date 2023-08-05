import {NestFactory, Reflector} from '@nestjs/core'
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from 'path';
import * as session from 'express-session'
import * as passport from 'passport'
import {AuthenticatedGuard} from '@modules/base/guards/authenticated.guard'
import {RolesGuard} from '@modules/base/guards/roles.guard'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.use(
        session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false
        })
    )

    const reflector = app.get(Reflector)
    app.useGlobalGuards(new AuthenticatedGuard(reflector))
    app.useGlobalGuards(new RolesGuard(reflector))

    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(3000)
}

bootstrap();

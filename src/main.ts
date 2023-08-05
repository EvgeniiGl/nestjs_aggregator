import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {NestExpressApplication} from "@nestjs/platform-express";
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
  );
  // app.setGlobalPrefix('api')
  // app.use(
  //     session({
  //       secret: 'hotelSecret',
  //       resave: false,
  //       saveUninitialized: false
  //     })
  // )
  // app.useGlobalInterceptors(new ExceptionInterceptor())
  // const reflector = app.get(Reflector)
  // eGlobalGuards(new AuthenticatedGuard(reflector))
  // app.useGlobalGuards(new RolesGuard(reflector))
  //
  // app.use(passport.initialize())
  // app.use(passport.session())
  // app.useGlobalPipes(new ValidationPipe())
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');
  await app.listen(3000);





}

bootstrap();

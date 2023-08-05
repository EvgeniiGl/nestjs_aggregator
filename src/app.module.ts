import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {UsersModule} from '@modules/users/users.module'
import {HotelsModule} from "@modules/hotels/hotels.module";
import {ReservationsModule} from "@modules/reservations/reservations.module";
import {AuthModule} from "@modules/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_CONNECT),
        HttpModule,
        UsersModule,
        HotelsModule,
        ReservationsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {
}

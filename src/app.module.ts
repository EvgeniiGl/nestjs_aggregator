import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_CONNECT),
        HttpModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}

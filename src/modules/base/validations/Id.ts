import {IsDefined, IsMongoId} from 'class-validator';
import {Types} from "mongoose";

export class Id {
    @IsDefined()
    @IsMongoId()
    id: Types.ObjectId;
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema({
    collection: 'wallet',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})
export class Wallet {
    _id?: MongooseSchema.Types.UUID;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    owned_by: string;

    @Prop({
        type: String,
        required: true
    })
    status: string;

    @Prop({
        type: String
    })
    enabled_at?: Date;

    @Prop({
        type: Number
    })
    balance?: number;
}

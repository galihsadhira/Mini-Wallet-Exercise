import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
    collection: 'wallet',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class Wallet {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.UUID,
        default: () => uuidv4(),
        unique: true,
    })
    id: MongooseSchema.Types.UUID;

    @Prop({
        type: MongooseSchema.Types.UUID,
        unique: true,
        required: true,
    })
    owned_by: MongooseSchema.Types.UUID;

    @Prop({
        type: String,
        default: 'disabled',
    })
    status?: string;

    @Prop({
        type: Date,
        default: null,
    })
    enabled_at?: Date;

    @Prop({
        type: Date,
        default: null,
    })
    disabled_at?: Date;

    @Prop({
        type: Number,
        default: 0,
    })
    balance: number;

    @Prop({
        type: Date,
        default: null,
    })
    created_at?: Date;

    @Prop({
        type: Date,
        default: null,
    })
    updated_at?: Date;
}

export type WalletDocument = Wallet & Document;

export const WalletSchema = SchemaFactory.createForClass(Wallet);

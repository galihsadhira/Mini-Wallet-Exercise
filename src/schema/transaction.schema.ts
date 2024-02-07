import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    collection: 'transactions',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class Transaction {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.UUID,
        unique: true,
    })
    reference_id: MongooseSchema.Types.UUID;

    @Prop({
        type: MongooseSchema.Types.UUID,
        required: true,
    })
    transacted_by: MongooseSchema.Types.UUID;

    @Prop({
        type: Date,
        default: null,
    })
    transacted_at?: Date;

    @Prop({
        type: Number,
        default: 0,
    })
    amount: number;

    @Prop({
        type: String,
    })
    status: string;

    @Prop({
        type: String,
    })
    type: string;

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

export type TransactionDocument = Transaction & Document;

export const TransactionSchema =
    SchemaFactory.createForClass(Transaction);

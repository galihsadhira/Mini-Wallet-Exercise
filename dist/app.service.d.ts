/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { CombinedModel } from './common/types/combined-model.type';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionDocument } from './schema/transaction.schema';
export declare class AppService {
    private readonly authService;
    private readonly jwtService;
    private readonly walletModel;
    private readonly transactionModel;
    constructor(authService: AuthService, jwtService: JwtService, walletModel: CombinedModel<WalletDocument>, transactionModel: CombinedModel<TransactionDocument>);
    getHello(): string;
    get wallet(): CombinedModel<WalletDocument>;
    get transaction(): CombinedModel<TransactionDocument>;
    intialize(customer_xid: any): Promise<{
        token: string;
    }>;
    validate(token: string): Promise<any>;
    getWallet(authorization: string): Promise<import("mongoose").Document<unknown, {}, WalletDocument> & Wallet & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}

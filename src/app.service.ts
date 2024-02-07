import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CombinedModel } from './common/types/combined-model.type';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { AuthService } from './auth/auth.service';
// import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import {
    Transaction,
    TransactionDocument,
} from './schema/transaction.schema';

@Injectable()
export class AppService {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        @InjectModel(Wallet.name)
        private readonly walletModel: CombinedModel<WalletDocument>,
        @InjectModel(Transaction.name)
        private readonly transactionModel: CombinedModel<TransactionDocument>
    ) {}

    getHello(): string {
        return 'Hello World!';
    }

    get wallet(): CombinedModel<WalletDocument> {
        return this.walletModel;
    }

    get transaction(): CombinedModel<TransactionDocument> {
        return this.transactionModel;
    }

    async intialize(customer_xid: any) {
        const find = await this.wallet.findOne({
            owned_by: customer_xid,
        });

        if (find)
            throw new BadRequestException('Wallet already created');

        const wallet = await this.wallet.create({
            owned_by: customer_xid,
        });

        const token = await this.authService.getToken(
            wallet.owned_by
        );

        return token;
    }

    async validate(token: string) {
        const owned_by = await this.jwtService.decode(token);

        return owned_by;
    }

    async getWallet(authorization: string) {
        if (authorization?.split(' ')[0] !== 'Token')
            throw new UnauthorizedException('Unauthorized');

        const token = authorization?.split(' ')[1];

        const decode = await this.validate(token);

        if (!decode) throw new NotFoundException('Not found');

        const find_wallet = await this.wallet.findOne({
            owned_by: decode.owned_by,
        });

        return find_wallet;
    }
}

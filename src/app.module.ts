import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import {
    Transaction,
    TransactionSchema,
} from './schema/transaction.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forRoot(
            `mongodb+srv://galihsadhira:5LXAhy43cYS6RjcV@miniwallet.mcldjkd.mongodb.net/`
        ),
        MongooseModule.forFeatureAsync([
            {
                name: Wallet.name,
                useFactory: () => {
                    const schema = WalletSchema;
                    return schema;
                },
            },
            {
                name: Transaction.name,
                useFactory: () => {
                    const schema = TransactionSchema;
                    return schema;
                },
            },
        ]),
        AuthModule,
        JwtModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

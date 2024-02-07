import { AppService } from './app.service';
import { InitiateWalletDto } from './dto/init.dto';
import { Response } from 'express';
import { TransactionDto } from './dto/transactions.dto';
import { DisableDto } from './dto/disable.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    init(res: Response, body: InitiateWalletDto): Promise<Response<any, Record<string, any>>>;
    enableWallet(res: Response, apiKey: any): Promise<Response<any, Record<string, any>>>;
    getWallet(res: Response, apiKey: any): Promise<Response<any, Record<string, any>>>;
    getWalletTransactions(res: Response, apiKey: any): Promise<Response<any, Record<string, any>>>;
    deposit(res: Response, apiKey: any, body: TransactionDto): Promise<Response<any, Record<string, any>>>;
    withdrawals(res: Response, apiKey: any, body: TransactionDto): Promise<Response<any, Record<string, any>>>;
    disabling(res: Response, apiKey: any, body: DisableDto): Promise<Response<any, Record<string, any>>>;
}

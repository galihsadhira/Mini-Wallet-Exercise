import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    HttpStatus,
    Headers,
    UseInterceptors,
    BadRequestException,
    NotFoundException,
    Patch,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InitiateWalletDto } from './dto/init.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionDto } from './dto/transactions.dto';
import { DisableDto } from './dto/disable.dto';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    //Initialize wallet
    @Post('init')
    @UseInterceptors(FileInterceptor('file'))
    async init(
        @Res() res: Response,
        @Body() body: InitiateWalletDto
    ) {
        try {
            const { customer_xid } = body;

            if (!customer_xid)
                throw new BadRequestException({
                    customer_xid: [
                        'Missing data for required field.',
                    ],
                });

            const token = await this.appService.intialize(
                body?.customer_xid
            );

            return res.status(HttpStatus.CREATED).json({
                data: token,
                status: 'success',
            });
        } catch (err) {
            return res.status(err?.status).json({
                data: {
                    error: err?.response,
                },
                status: err?.status === 400 ? 'fail' : err?.status,
            });
        }
    }

    //Enable wallet
    @Post('wallet')
    async enableWallet(
        @Res() res: Response,
        @Headers('Authorization') apiKey
    ) {
        try {
            const find_wallet = await this.appService.getWallet(
                apiKey
            );

            if (!find_wallet)
                throw new NotFoundException('Not found');
            else if (find_wallet?.status === 'enabled')
                throw new BadRequestException('Already enabled');

            find_wallet.status = 'enabled';
            find_wallet.enabled_at = new Date();

            find_wallet.save();

            const data = {
                wallet: {
                    id: find_wallet?.id?.toString(),
                    owned_by: find_wallet?.owned_by?.toString(),
                    status: find_wallet?.status,
                    enabled_at: find_wallet?.enabled_at,
                    balance: find_wallet?.balance,
                },
            };
            return res.status(HttpStatus.OK).json({
                status: 'success',
                data,
            });
        } catch (err) {
            return res.status(err?.status).json({
                status: err?.status === 400 ? 'fail' : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }

    //View wallet
    @Get('wallet')
    async getWallet(
        @Res() res: Response,
        @Headers('Authorization') apiKey
    ) {
        try {
            const find_wallet = await this.appService.getWallet(
                apiKey
            );

            if (!find_wallet)
                throw new NotFoundException('Not found');
            else if (find_wallet?.status === 'disabled')
                throw new NotFoundException('Walllet disabled');

            const data = {
                wallet: {
                    id: find_wallet?.id?.toString(),
                    owned_by: find_wallet?.owned_by?.toString(),
                    status: find_wallet?.status,
                    enabled_at: find_wallet?.enabled_at,
                    balance: find_wallet?.balance,
                },
            };
            return res.status(HttpStatus.OK).json({
                status: 'success',
                data,
            });
        } catch (err) {
            return res.status(err?.status).json({
                status: err?.status === 404 ? 'fail' : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }

    //View transactions
    @Get('wallet/transactions')
    async getWalletTransactions(
        @Res() res: Response,
        @Headers('Authorization') apiKey
    ) {
        try {
            const wallet = await this.appService.getWallet(apiKey);

            if (!wallet) throw new NotFoundException('Not found');
            else if (wallet?.status === 'disabled')
                throw new NotFoundException('Walllet disabled');

            const transactions =
                await this.appService.transaction.find({
                    transacted_by: wallet.owned_by,
                });

            const result = transactions?.map((e) => {
                return {
                    id: e?.id?.toString(),
                    status: e?.status,
                    transacted_at: e?.transacted_at,
                    type: e?.type,
                    amount: e?.amount,
                    reference_id: e?.reference_id?.toString(),
                };
            });

            const data = {
                transactions: result,
            };

            return res.status(HttpStatus.OK).json({
                status: 'success',
                data,
            });
        } catch (err) {
            return res.status(err?.status).json({
                status: err?.status === 404 ? 'fail' : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }

    //Depsit money
    @Post('wallet/deposits')
    @UseInterceptors(FileInterceptor('file'))
    async deposit(
        @Res() res: Response,
        @Headers('Authorization') apiKey,
        @Body() body: TransactionDto
    ) {
        try {
            const { reference_id, amount } = body;
            if (!reference_id)
                throw new BadRequestException(
                    'reference_id is required'
                );
            if (!amount)
                throw new BadRequestException('amount is required');
            else if (isNaN(+amount))
                throw new BadRequestException(
                    'amount must be a number'
                );

            const validate_transaction =
                await this.appService.transaction.findOne({
                    reference_id,
                });

            if (validate_transaction)
                throw new BadRequestException(
                    'reference_id must be unique'
                );

            const wallet = await this.appService.getWallet(apiKey);

            if (!wallet) throw new NotFoundException('Not found');
            else if (wallet?.status === 'disabled')
                throw new BadRequestException('Walllet disabled');

            const deposit = await this.appService.transaction.create({
                reference_id: reference_id,
                amount,
                transacted_by: wallet?.owned_by,
                transacted_at: new Date(),
                type: 'deposit',
                status: 'success',
            });

            const new_balance = +wallet.balance + +amount;

            wallet.balance = new_balance;
            wallet.save();

            const data = {
                deposit: {
                    id: deposit?.id?.toString(),
                    deposited_by: wallet?.owned_by?.toString(),
                    status: 'success',
                    deposited_at: deposit?.transacted_at,
                    amount: deposit?.amount,
                    reference_id: deposit?.reference_id?.toString(),
                },
            };

            return res.status(HttpStatus.CREATED).json({
                status: 'success',
                data,
            });
        } catch (err) {
            return res.status(err?.status).json({
                status:
                    err?.status === 400 || err?.status === 404
                        ? 'fail'
                        : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }

    //Withdraw money
    @Post('wallet/withdrawals')
    @UseInterceptors(FileInterceptor('file'))
    async withdrawals(
        @Res() res: Response,
        @Headers('Authorization') apiKey,
        @Body() body: TransactionDto
    ) {
        try {
            const { reference_id, amount } = body;

            if (!reference_id)
                throw new BadRequestException(
                    'reference_id is required'
                );
            if (!amount)
                throw new BadRequestException('amount is required');
            else if (isNaN(+amount))
                throw new BadRequestException(
                    'amount must be a number'
                );

            const validate_transaction =
                await this.appService.transaction.findOne({
                    reference_id,
                });

            if (validate_transaction)
                throw new BadRequestException(
                    'reference_id must be unique'
                );

            const wallet = await this.appService.getWallet(apiKey);

            if (!wallet) throw new NotFoundException('Not found');
            else if (wallet?.status === 'disabled')
                throw new BadRequestException('Walllet disabled');

            const withdrawals =
                await this.appService.transaction.create({
                    reference_id: reference_id,
                    amount,
                    transacted_by: wallet.owned_by,
                    transacted_at: new Date(),
                    type: 'withdrawals',
                    status:
                        +wallet.balance >= +amount
                            ? 'success'
                            : 'failed',
                });

            const new_balance = +wallet.balance - +amount;

            if (new_balance >= 0) {
                wallet.balance = new_balance;
                wallet.save();
            }

            const data = {
                deposit: {
                    id: withdrawals?.id?.toString(),
                    withdrawn_by: wallet?.owned_by?.toString(),
                    status:
                        +wallet?.balance >= +amount
                            ? 'success'
                            : 'failed',
                    withdrawn_at: withdrawals?.transacted_at,
                    amount: withdrawals?.amount,
                    reference_id:
                        withdrawals?.reference_id?.toString(),
                },
            };

            return res.status(HttpStatus.CREATED).json({
                status:
                    +wallet.balance >= +amount ? 'success' : 'failed',
                data,
            });
        } catch (err) {
            return res.json({
                status:
                    err?.status === 400 || err?.status === 404
                        ? 'fail'
                        : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }

    //Disable wallet
    @Patch('wallet')
    @UseInterceptors(FileInterceptor('file'))
    async disabling(
        @Res() res: Response,
        @Headers('Authorization') apiKey,
        @Body() body: DisableDto
    ) {
        try {
            const { is_disabled } = body;

            if (!is_disabled)
                throw new BadRequestException(
                    'is_disabled is required'
                );

            const find_wallet = await this.appService.getWallet(
                apiKey
            );

            if (!find_wallet)
                throw new NotFoundException('Not found');
            else if (find_wallet?.status === 'disabled')
                throw new BadRequestException('Already disabled');

            if (is_disabled?.toString() === 'true') {
                find_wallet.status = 'disabled';
                find_wallet.disabled_at = new Date();

                find_wallet.save();
            }

            const data = {
                wallet: {
                    id: find_wallet.id.toString(),
                    owned_by: find_wallet.owned_by.toString(),
                    status: find_wallet.status,
                    disabled_at: find_wallet.disabled_at,
                    balance: find_wallet.balance,
                },
            };
            return res.status(HttpStatus.OK).json({
                status: 'success',
                data,
            });
        } catch (err) {
            return res.status(err?.status).json({
                status:
                    err?.status === 400 || err?.status === 404
                        ? 'fail'
                        : err?.status,
                data: {
                    error: err?.message,
                },
            });
        }
    }
}

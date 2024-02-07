"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const init_dto_1 = require("./dto/init.dto");
const platform_express_1 = require("@nestjs/platform-express");
const transactions_dto_1 = require("./dto/transactions.dto");
const disable_dto_1 = require("./dto/disable.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async init(res, body) {
        try {
            const { customer_xid } = body;
            if (!customer_xid)
                throw new common_1.BadRequestException({
                    customer_xid: [
                        'Missing data for required field.',
                    ],
                });
            const token = await this.appService.intialize(body === null || body === void 0 ? void 0 : body.customer_xid);
            return res.status(common_1.HttpStatus.CREATED).json({
                data: token,
                status: 'success',
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                data: {
                    error: err === null || err === void 0 ? void 0 : err.response,
                },
                status: (err === null || err === void 0 ? void 0 : err.status) === 400 ? 'fail' : err === null || err === void 0 ? void 0 : err.status,
            });
        }
    }
    async enableWallet(res, apiKey) {
        var _a, _b;
        try {
            const find_wallet = await this.appService.getWallet(apiKey);
            if (!find_wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.status) === 'enabled')
                throw new common_1.BadRequestException('Already enabled');
            find_wallet.status = 'enabled';
            find_wallet.enabled_at = new Date();
            find_wallet.save();
            const data = {
                wallet: {
                    id: (_a = find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    owned_by: (_b = find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.owned_by) === null || _b === void 0 ? void 0 : _b.toString(),
                    status: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.status,
                    enabled_at: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.enabled_at,
                    balance: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.balance,
                },
            };
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                data,
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 400 ? 'fail' : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
    async getWallet(res, apiKey) {
        var _a, _b;
        try {
            const find_wallet = await this.appService.getWallet(apiKey);
            if (!find_wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.status) === 'disabled')
                throw new common_1.NotFoundException('Walllet disabled');
            const data = {
                wallet: {
                    id: (_a = find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    owned_by: (_b = find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.owned_by) === null || _b === void 0 ? void 0 : _b.toString(),
                    status: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.status,
                    enabled_at: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.enabled_at,
                    balance: find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.balance,
                },
            };
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                data,
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 404 ? 'fail' : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
    async getWalletTransactions(res, apiKey) {
        try {
            const wallet = await this.appService.getWallet(apiKey);
            if (!wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((wallet === null || wallet === void 0 ? void 0 : wallet.status) === 'disabled')
                throw new common_1.NotFoundException('Walllet disabled');
            const transactions = await this.appService.transaction.find({
                transacted_by: wallet.owned_by,
            });
            const result = transactions === null || transactions === void 0 ? void 0 : transactions.map((e) => {
                var _a, _b;
                return {
                    id: (_a = e === null || e === void 0 ? void 0 : e.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    status: e === null || e === void 0 ? void 0 : e.status,
                    transacted_at: e === null || e === void 0 ? void 0 : e.transacted_at,
                    type: e === null || e === void 0 ? void 0 : e.type,
                    amount: e === null || e === void 0 ? void 0 : e.amount,
                    reference_id: (_b = e === null || e === void 0 ? void 0 : e.reference_id) === null || _b === void 0 ? void 0 : _b.toString(),
                };
            });
            const data = {
                transactions: result,
            };
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                data,
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 404 ? 'fail' : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
    async deposit(res, apiKey, body) {
        var _a, _b, _c;
        try {
            const { reference_id, amount } = body;
            if (!reference_id)
                throw new common_1.BadRequestException('reference_id is required');
            if (!amount)
                throw new common_1.BadRequestException('amount is required');
            else if (isNaN(+amount))
                throw new common_1.BadRequestException('amount must be a number');
            const validate_transaction = await this.appService.transaction.findOne({
                reference_id,
            });
            if (validate_transaction)
                throw new common_1.BadRequestException('reference_id must be unique');
            const wallet = await this.appService.getWallet(apiKey);
            if (!wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((wallet === null || wallet === void 0 ? void 0 : wallet.status) === 'disabled')
                throw new common_1.BadRequestException('Walllet disabled');
            const deposit = await this.appService.transaction.create({
                reference_id: reference_id,
                amount,
                transacted_by: wallet === null || wallet === void 0 ? void 0 : wallet.owned_by,
                transacted_at: new Date(),
                type: 'deposit',
                status: 'success',
            });
            const new_balance = +wallet.balance + +amount;
            wallet.balance = new_balance;
            wallet.save();
            const data = {
                deposit: {
                    id: (_a = deposit === null || deposit === void 0 ? void 0 : deposit.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    deposited_by: (_b = wallet === null || wallet === void 0 ? void 0 : wallet.owned_by) === null || _b === void 0 ? void 0 : _b.toString(),
                    status: 'success',
                    deposited_at: deposit === null || deposit === void 0 ? void 0 : deposit.transacted_at,
                    amount: deposit === null || deposit === void 0 ? void 0 : deposit.amount,
                    reference_id: (_c = deposit === null || deposit === void 0 ? void 0 : deposit.reference_id) === null || _c === void 0 ? void 0 : _c.toString(),
                },
            };
            return res.status(common_1.HttpStatus.CREATED).json({
                status: 'success',
                data,
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 400 || (err === null || err === void 0 ? void 0 : err.status) === 404
                    ? 'fail'
                    : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
    async withdrawals(res, apiKey, body) {
        var _a, _b, _c;
        try {
            const { reference_id, amount } = body;
            if (!reference_id)
                throw new common_1.BadRequestException('reference_id is required');
            if (!amount)
                throw new common_1.BadRequestException('amount is required');
            else if (isNaN(+amount))
                throw new common_1.BadRequestException('amount must be a number');
            const validate_transaction = await this.appService.transaction.findOne({
                reference_id,
            });
            if (validate_transaction)
                throw new common_1.BadRequestException('reference_id must be unique');
            const wallet = await this.appService.getWallet(apiKey);
            if (!wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((wallet === null || wallet === void 0 ? void 0 : wallet.status) === 'disabled')
                throw new common_1.BadRequestException('Walllet disabled');
            const withdrawals = await this.appService.transaction.create({
                reference_id: reference_id,
                amount,
                transacted_by: wallet.owned_by,
                transacted_at: new Date(),
                type: 'withdrawals',
                status: +wallet.balance >= +amount
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
                    id: (_a = withdrawals === null || withdrawals === void 0 ? void 0 : withdrawals.id) === null || _a === void 0 ? void 0 : _a.toString(),
                    withdrawn_by: (_b = wallet === null || wallet === void 0 ? void 0 : wallet.owned_by) === null || _b === void 0 ? void 0 : _b.toString(),
                    status: +(wallet === null || wallet === void 0 ? void 0 : wallet.balance) >= +amount
                        ? 'success'
                        : 'failed',
                    withdrawn_at: withdrawals === null || withdrawals === void 0 ? void 0 : withdrawals.transacted_at,
                    amount: withdrawals === null || withdrawals === void 0 ? void 0 : withdrawals.amount,
                    reference_id: (_c = withdrawals === null || withdrawals === void 0 ? void 0 : withdrawals.reference_id) === null || _c === void 0 ? void 0 : _c.toString(),
                },
            };
            return res.status(common_1.HttpStatus.CREATED).json({
                status: +wallet.balance >= +amount ? 'success' : 'failed',
                data,
            });
        }
        catch (err) {
            return res.json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 400 || (err === null || err === void 0 ? void 0 : err.status) === 404
                    ? 'fail'
                    : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
    async disabling(res, apiKey, body) {
        try {
            const { is_disabled } = body;
            if (!is_disabled)
                throw new common_1.BadRequestException('is_disabled is required');
            const find_wallet = await this.appService.getWallet(apiKey);
            if (!find_wallet)
                throw new common_1.NotFoundException('Not found');
            else if ((find_wallet === null || find_wallet === void 0 ? void 0 : find_wallet.status) === 'disabled')
                throw new common_1.BadRequestException('Already disabled');
            if ((is_disabled === null || is_disabled === void 0 ? void 0 : is_disabled.toString()) === 'true') {
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
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                data,
            });
        }
        catch (err) {
            return res.status(err === null || err === void 0 ? void 0 : err.status).json({
                status: (err === null || err === void 0 ? void 0 : err.status) === 400 || (err === null || err === void 0 ? void 0 : err.status) === 404
                    ? 'fail'
                    : err === null || err === void 0 ? void 0 : err.status,
                data: {
                    error: err === null || err === void 0 ? void 0 : err.message,
                },
            });
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('init'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, init_dto_1.InitiateWalletDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "init", null);
__decorate([
    (0, common_1.Post)('wallet'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "enableWallet", null);
__decorate([
    (0, common_1.Get)('wallet'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)('wallet/transactions'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getWalletTransactions", null);
__decorate([
    (0, common_1.Post)('wallet/deposits'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, transactions_dto_1.TransactionDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)('wallet/withdrawals'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, transactions_dto_1.TransactionDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "withdrawals", null);
__decorate([
    (0, common_1.Patch)('wallet'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, disable_dto_1.DisableDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "disabling", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_schema_1 = require("./schema/wallet.schema");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const transaction_schema_1 = require("./schema/transaction.schema");
let AppService = class AppService {
    constructor(authService, jwtService, walletModel, transactionModel) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
    }
    getHello() {
        return 'Hello World!';
    }
    get wallet() {
        return this.walletModel;
    }
    get transaction() {
        return this.transactionModel;
    }
    async intialize(customer_xid) {
        const find = await this.wallet.findOne({
            owned_by: customer_xid,
        });
        if (find)
            throw new common_1.BadRequestException('Wallet already created');
        const wallet = await this.wallet.create({
            owned_by: customer_xid,
        });
        const token = await this.authService.getToken(wallet.owned_by);
        return token;
    }
    async validate(token) {
        const owned_by = await this.jwtService.decode(token);
        return owned_by;
    }
    async getWallet(authorization) {
        if ((authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[0]) !== 'Token')
            throw new common_1.UnauthorizedException('Unauthorized');
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const decode = await this.validate(token);
        if (!decode)
            throw new common_1.NotFoundException('Not found');
        const find_wallet = await this.wallet.findOne({
            owned_by: decode.owned_by,
        });
        return find_wallet;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(3, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService, Object, Object])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map
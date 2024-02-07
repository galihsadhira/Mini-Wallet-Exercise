import { IsNotEmpty, IsUUID } from 'class-validator';

export class InitiateWalletDto {
    @IsNotEmpty()
    @IsUUID()
    customer_xid: string;
}

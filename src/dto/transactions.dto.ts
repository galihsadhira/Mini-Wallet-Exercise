import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
export class TransactionDto {
    @IsNotEmpty()
    @IsNumber()
    amount?: number;

    @IsNotEmpty()
    @IsUUID()
    reference_id: string;
}

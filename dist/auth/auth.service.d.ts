import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getToken(payload: any): Promise<{
        token: string;
    }>;
}

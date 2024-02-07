/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async getToken(payload: any) {
        const token = await this.jwtService.signAsync({
            owned_by: payload,
        });

        return {
            token,
        };
    }
}

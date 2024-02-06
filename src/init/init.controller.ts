import { Controller, Res, Post, UseGuards } from '@nestjs/common';
import { Response } from 'express';

@Controller('init')
export class InitController {
    constructor() {}

    @Post()
    async init(@Res() res: Response) {}
}

// @UseGuards(JwtAuthGuard)

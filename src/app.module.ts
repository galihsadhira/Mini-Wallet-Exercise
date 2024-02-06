import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot(
            `mongodb+srv://galihsadhira:EBCYTOd4N9W43LDY@cluster0.3v8vzv8.mongodb.net/?retryWrites=true&w=majority`
        )
        // MongooseModule.forFeature([{name: `raw_data`, schema: DataSchema}]),
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}

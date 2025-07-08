import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [MongooseModule.forRoot('"MongoDB-Creds"'), BuilderModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

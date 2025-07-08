import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';

@Module({
  imports: [MongooseModule.forRoot('"MongoDB-Password"'), BuilderModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

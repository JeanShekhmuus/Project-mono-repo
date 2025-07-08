import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Dominik:Dominik2@microservicescluster.bb1au.mongodb.net/shop-database?retryWrites=true&w=majority'), BuilderModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

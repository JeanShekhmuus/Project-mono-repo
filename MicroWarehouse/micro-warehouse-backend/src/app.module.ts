import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [MongooseModule.forRoot('mongodb+srv://JeanShekhmuus:Jean-1234-@jeancluster.a19aw.mongodb.net/JeanDb?retryWrites=true&w=majority'), BuilderModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

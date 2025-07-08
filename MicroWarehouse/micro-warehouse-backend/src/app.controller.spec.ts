import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module'

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot('mongodb+srv://JeanShekhmuus:Jean-1234-@jeancluster.a19aw.mongodb.net/JeanDb?retryWrites=true&w=majority')],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello Course!"', () => {
      expect(appController.getHello()).toBe('Hello Course!');
    });
  });
});

import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, OnModuleInit, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BuildEvent } from './modules/builder/build-event.schema';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';

@Controller()
export class AppController implements OnModuleInit {
 
  publishers : any[] = []
  logger: any;

  constructor(
    private readonly appService: AppService,
    private httpService: HttpService
    ) {}

  onModuleInit() {
    this.subscribeAtShop('start visit')
  }

  private subscribeAtShop(reason) {

    //subscribe at shop
    this.httpService.post('http://localhost:3100/subscribe', {
      subscribeUrl: 'http://localhost:3000/event',
      lastEventTime: '0',
      reason: reason
    }).subscribe(
      async (response) => {
        this.publishers.push('http://localhost:3000')
        try {
          const eventList: any[] = response.data;
          console.log(`AppController onModuleInit subscribe list` + JSON.stringify(eventList, null, 3));
        } catch (error) {
          console.log(`AppController onModuleInit subscribe handleEvent error` + JSON.stringify(error, null, 3))
        }
      },
      error => {
        console.log(`AppController onModuleInit error` + JSON.stringify(error, null, 3))
      }
    )
  }

  // http://localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    console.log(`appController.getQuery called with key ${key}`)
    const result = await this.appService.getQuery(key);
    return result;
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      const c = await this.appService.handleCommand(command);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('event') 
  async postEvent(@Body() event: BuildEvent) {
    try {
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/pickDone')
  async postPickDone(@Body() params: any) {
    try {
      this.logger.log(`\npostPickDone got ${JSON.stringify(params, null, 3)}`)
      const c = await this.appService.handlePickDone(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      const c = await this.appService.handleSubscription(subscription);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

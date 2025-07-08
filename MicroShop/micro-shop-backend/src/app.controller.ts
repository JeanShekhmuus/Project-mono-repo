import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, OnModuleInit, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto'
import { BuildEvent } from './modules/builder/build-event.schema'
import Subscription from './modules/builder/subscription';

@Controller()
export class AppController implements OnModuleInit {

  public port = process.env.PORT || 3100
  public shopUrl = "http://localhost:3100/";
  public warehouseUrl = "http://localhost:3000/"

  publishers : any[] = []

  constructor(
    private httpService: HttpService,
    private readonly appService: AppService
  ) {
    if(this.port != 3100) {
      this.shopUrl = "https://jeanshekhmuus-shop-backend.herokuapp.com/"
      this.warehouseUrl = "https://jeanshekhmuus-warehouse-back.herokuapp.com/"
    }
   }

  onModuleInit() {
      this.subscribeAtWarehouse('start visit')
  }

  private subscribeAtWarehouse(reason) {

      //subscribe at warehouse
      this.httpService.post(this.warehouseUrl + 'subscribe', {
        subscriberUrl: this.shopUrl + 'event',
        lastEventTime: '0',
        reason: reason
      }).subscribe(
        async (response) => {
          this.publishers.push(this.warehouseUrl);
          try {
            const eventList: any[] = response.data;
            // console.log(`AppController onModuleInit subscribe list` + JSON.stringify(eventList, null, 3));
            for (const event of eventList) {
              await this.appService.handleEvent(event);
            }
          } catch (error) {
            console.log(`AppController onModuleInit subscribe handleEvent error` + JSON.stringify(error, null, 3))
          }
        },
        error => {
          console.log(`AppController onModuleInit error` + JSON.stringify(error, null, 3))
        });
  }

  @Post('cmd/setPrice')
  async postSetPrice(@Body() params: SetPriceDto) {
    try {
      const c = await this.appService.setPrice(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/placeOrder')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    try {
      const c = await this.appService.placeOrder(params);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      // console.log(`\npostSubscribe got subscription ${JSON.stringify(subscription, null, 3)}`)
      const c = await this.appService.handleSubscription(subscription);
      if (subscription.reason === 'start visit') {
        this.subscribeAtWarehouse('return visit')
      }
      return c;
    } catch (error) {
      return error;
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    const result = await this.appService.getQuery(key);
    return result;
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      console.log('MicroShop app controller postEvent got \n' + JSON.stringify(event, null, 3))
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }
}

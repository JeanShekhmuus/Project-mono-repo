import { Injectable } from '@nestjs/common';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { SetPriceDto } from './common/SetPriceDto';
import { BuildEvent } from './modules/builder/build-event.schema'
import { BuilderService } from './modules/builder/builder.service'
import Subscription from './modules/builder/subscription';

@Injectable()
export class AppService {

  constructor(
    private readonly modelBuilderService: BuilderService,
  ) {}

  getHello(): string {
    return 'Hello Course!';
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subscription)
  }

  async getQuery(key: string): Promise<any> {
    if (key === "customers") {
      return await this.modelBuilderService.getCustomers();
    } 
    else if (key === "products") {
      return await this.modelBuilderService.getProducts();
    } 
    else if (key.startsWith('product-')) {
      const name = key.substring('product-'.length);
      return await this.modelBuilderService.getProduct(name);
    } 
    else if (key.startsWith('orders_')) {
      const customer = key.substring('orders_'.length);
      return await this.modelBuilderService.getOrdersOf(customer);
    } 
    else {
      return {error: 'Microshop backend does not know how to handle query key ' + key}
    }
  }

  setPrice(params: SetPriceDto) {
    this.modelBuilderService.setPrice(params);
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'The shop database is clear.';
  }

  async placeOrder(params: PlaceOrderDto) {
    await this.modelBuilderService.placeOrder(params);
    return 200;
  }

  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productStored') {
      console.log(`app service handleEvent \n`)
      return await this.modelBuilderService.handleProductStored(event);
    }
    else if (event.eventType === 'addOffer') {
      return await this.modelBuilderService.handleAddOffer(event);
    }
    else if (event.eventType === 'placeOrder') {
      return await this.modelBuilderService.handlePlaceOrder(event);
    }
    else if (event.eventType === 'orderPicked') {
      return await this.modelBuilderService.handleOrderPicked(event);
    }
    return {error: 'shop backend does not know hot to handle ' + event.eventType};
  }
}

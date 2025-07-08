import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { PlaceOrderDto } from 'src/common/PlaceOrderDto';
import { SetPriceDto } from 'src/common/SetPriceDto';
import { BuildEvent } from './build-event.schema';
import { Customer } from './customer.schema';
import { Order } from './orders.schema';
import { MSProduct } from './product.schema';
import Subscription from './subscription';

@Injectable()
export class BuilderService implements OnModuleInit{
    
    subscriberUrls: string[] = [];

    constructor(
        private httpService: HttpService,
        @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
        @InjectModel('products') private productsModel: Model<MSProduct>,
        @InjectModel('orders') private ordersModel: Model<Order>,
        @InjectModel('customers') private customersModel: Model<Customer>
    )
    {

    }
    
    async onModuleInit() {
        await this.reset();
    }

    async clear() {
        await this.productsModel.deleteMany();
        await this.buildEventModel.deleteMany();

        await this.storeProduct({
            product: 'jeans',
            amount: 10,
            amountTime: '12:00',
            price: 0.0,
        })

        await this.storeProduct({
            product: 'tshirt',
            amount: 11,
            amountTime: '12:01',
            price: 0.0,
        })

        await this.storeProduct({
            product: 'socks',
            amount: 12,
            amountTime: '12:02',
            price: 0.0,
        })
    }

    async getCustomers() {
        return await this.customersModel.find({}).exec();
    }

    async getProducts() {
        return await this.productsModel.find({}).exec();
    }

    async getProduct(name) {
        return await this.productsModel.findOne({product: name}).exec();
    }

    async getOrdersOf(customer) {
        return await this.ordersModel.find({customer: customer}).exec();
    }

    async setPrice(params: SetPriceDto) {
        return await this.productsModel.findOneAndUpdate(
            {product: params.product},
            {price: `${params.price}`},
            {new: true}
        ).exec()
    }

    async placeOrder(params: PlaceOrderDto) {
        const orderDto = {
                code: params.order,
                product: params.product,
                customer: params.customer,
                address: params.address,
                state: 'order placed',
            }
            const result = await this.ordersModel.findOneAndUpdate(
                { code: params.order },
                orderDto,
                {upsert: true, new: true}).exec()
            console.log(`placeOrder stored: \n ${JSON.stringify(result, null, 3)}`)

            const event = {
                blockId: params.order,
                time: new Date().toISOString(),
                eventType: 'productOrdered',
                tags: ['products', params.order],
                payload: params,
            };
            await this.storeEvent(event);
            this.publish(event);
    }

    async reset() {
        await this.clear();
    }

    
    async storeEvent(event: BuildEvent) {
        //ensure at least a placeholder
        const placeholder = await this.buildEventModel.findOneAndUpdate(
            { blockId: event.blockId},
            { blockId: event.blockId, $setOnInsert: {time: ''}},
            { upsert: true, new: true}
        ).exec();

        const newEvent = await this.buildEventModel.findOneAndUpdate(
            { blockId: event.blockId, time: {$lt: event.time}},
            {
                tags: event.tags,
                time: event.time,
                eventType: event.eventType,
                payload: event.payload,
            },
            { new: true}
        ).exec();

        return newEvent != null;
    }

    async handleSubscription(subscription: Subscription) {
        //store in subscriber list
        if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
            this.subscriberUrls.push(subscription.subscriberUrl);
        }

        //publish events after last event
        const eventList = await this.buildEventModel.find(
            {
                eventType: 'productStored',
                time: { $gt: subscription.lastEventTime }
            }
        ).exec();

        return eventList;
    }

    publish(newEvent: BuildEvent) {
        console.log(`build service publish subscriberUrls: \n`+ JSON.stringify(this.subscriberUrls, null, 3));
        const oldUrls = this.subscriberUrls;
        this.subscriberUrls = [];
        for (let subscriberUrl of oldUrls) {
            this.httpService.post(subscriberUrl, newEvent).subscribe(
                (response) => {
                    console.log('Warehouse builder service publish post response is \n' +
                        JSON.stringify(response.data, null, 3))
                    this.subscriberUrls.push(subscriberUrl);
                },
                (error) => {
                    console.log(`build service publish error: \n`+ JSON.stringify(error, null, 3));
                }
            );
        }
    }

    async storeProduct(newProductData:any) {
        try {
            const newProduct = await this.productsModel.findOneAndUpdate(
                {product: newProductData.product},
                newProductData,
                {upsert: true, new: true}).exec();
            return newProduct;
        } catch(error) {
            console.log('Error in BuilderService.storeProduct: \n' + JSON.stringify(error, null, 3))
        }
    }

    async handleProductStored(event: BuildEvent) {
        let newProduct = null;

        //store a build event
        const storeSuccess = await this.storeEvent(event);

        if (storeSuccess) {
            //store a product object
            const newAmount = await this.computeNewProductAmount(event.blockId)
            const productPatch = {
                product: event.blockId,
                amount: newAmount,
                amountTime: event.time,
            }
            newProduct = await this.storeProduct(productPatch)
        }
        else {
            newProduct = await this.productsModel.findOne({product: event.blockId});
        }
            
        return newProduct;
    }

    async handleAddOffer(event: BuildEvent) {
        //store a build event
        const storeSuccess = await this.storeEvent(event);
        let newProduct = null;

        if(storeSuccess) {
            //store a product object
            const productPatch = {
                product: event.payload.product,
                price: event.payload.price,
            }
            // console.log('BuilderService.handleAddOffer line 129: \n' + JSON.stringify(productPatch, null, 3));

            try{
                newProduct = await this.productsModel.findOneAndUpdate(
                    {product: productPatch.product},
                    productPatch,
                    {upsert: true, new: true}
                ).exec();
                console.log('BuilderService.handleAddOffer line 136: \n' + JSON.stringify(newProduct, null, 3));
                return newProduct;
            } catch (error) {
                console.log('Error in BuilderService.storeProduct: \n' + JSON.stringify(error, null, 3))
            }
        } else {
            newProduct = await this.productsModel.findOne({product: event.blockId});
        }

        return newProduct;
    }

    async handlePlaceOrder(event: BuildEvent) {
        // store a build event
        const storeSuccess = await this.storeEvent(event);
        let newOrder = null;

        if(storeSuccess) {
            //store an order object
            try {
                newOrder = await this.ordersModel.findOneAndUpdate(
                    {code: event.payload.code},
                    event.payload,
                    {upsert: true, new: true}
                ).exec();
                console.log('BuilderService.handlePlaceOrder line 165: \n' + JSON.stringify(newOrder, null, 3));

                //and upsert customer
                const newCustomer = await this.customersModel.findOneAndUpdate(
                    {name: event.payload.customer},
                    {
                        name: event.payload.customer,
                        lastAddress: event.payload.address,
                    },
                    {upsert: true, new: true}
                ).exec();

                //and update product amount
                const newAmount = await this.computeNewProductAmount(event.payload.product);
                await this.productsModel.findOneAndUpdate(
                    { product: event.payload.product },
                    { amount: newAmount }
                )

                return newOrder;
            } catch(error) {
                console.log('Error in BuilderService.handlePlaceOrder: \n' + JSON.stringify(error, null, 3))
            }
        } else {
            newOrder = await this.productsModel.findOne({product: event.blockId});
        }

        return newOrder;
    }

    async handleOrderPicked(event: BuildEvent) {
        const params = event.payload
        const order = await this.ordersModel.findOneAndUpdate(
            { code: params.code },
            {
                state: params.state
            },
            { new: true }
        ).exec();

        const newEvent = {
            blockId: order.code,
            time: new Date().toISOString(),
            eventType: 'orderPicked',
            tags: ['orders', order.code],
            payload: {
                code: order.code,
                product: order.product,
                
            }
        }
    }

    async computeNewProductAmount(productName) {
        //last productStored amount
        const lastStoreEvent = await this.buildEventModel.findOne({blockId: productName}).exec();
        const lastAmount = lastStoreEvent.payload.amount;

        //minus new orders
        const newOrdersList: any[] = await this.buildEventModel.find(
            {
                eventType: 'placeOrder',
                'payload.product': productName
            }
        ).exec();

        const newOrdersNumber = newOrdersList.length;

        //minus shipping orders later than last product stored
        const laterShippingList: any[] = await this.buildEventModel.find(
            {
                eventType: 'orderPicked',
                time: {$gt: lastStoreEvent.time},
                'payload.product': productName
            }
        ).exec();

        return lastAmount;
    }

}
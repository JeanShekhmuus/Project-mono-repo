import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/mongoose';
import { exec } from 'child_process';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import subscription from './subscription';

@Injectable()
export class BuilderService implements OnModuleInit {

    subscriberUrls: string[] = [];
    logger: any;
    paletteModel: any;
    pickTaskModel: any;

    constructor(
        private httpService: HttpService,
        @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>
    ) {

    }

    async onModuleInit() {
        await this.clear();

        this.store({
            blockId: 'pal042',
            time: '13:08:00',
            eventType: 'PaletteStored',
            tags: ['palettes', 'black tshirt'],
            payload: {
                barcode: 'pal042',
                product: 'black tshirt',
                amount: 8,
                location: 'shelf 01'
            }
        });

        this.store({
            blockId: 'pal043',
            time: '13:28:00',
            eventType: 'PaletteStored',
            tags: ['palettes', 'red shoes'],
            payload: {
                barcode: 'pal043',
                product: 'red shoes',
                amount: 12,
                location: 'shelf 02'
            }
        });
    }

    async getByTag(tag: string): Promise<any> {
        const list = this.buildEventModel.find({ tags: tag }).exec();
        return list;
    }

    async store(event: BuildEvent) {
        //ensure at least a placeholder
        const placeholder = await this.buildEventModel.findOneAndUpdate(
            { blockId: event.blockId },
            { blockId: event.blockId, $setOnInsert: { time: '' } },
            { upsert: true, new: true }
        ).exec();

        const newEvent = await this.buildEventModel.findOneAndUpdate(
            { blockId: event.blockId, time: { $lt: event.time } },
            event,
            { new: true }
        ).exec();

        return newEvent != null;
    }

    async storePalette(palette: any) {
        //should check the palette for consistency, later
        palette.amount = Number(palette.amount);

        const event = {
            blockId: palette.barcode,
            time: new Date().toISOString(),
            eventType: 'PaletteStored',
            tags: ['palettes', palette.product],
            payload: palette,
        };

        try {
            const storeSuccess = await this.store(event);

            const amount = await this.computeAmount(palette.product);

            if (storeSuccess) {

                await this.storeModelPalette(palette)

                const newEvent = {
                    eventType: 'productStored',
                    blockId: palette.product,
                    time: event.time,
                    tags: [],
                    payload: {
                        product: palette.product,
                        amount: amount,
                    }
                }

                await this.store(newEvent);
                //publish product stored event to shop
                this.publish(newEvent)
            }
        } catch (error) {
            console.log(`store did not work ${error}`);
        }

        return palette
    }


    async storeModelPalette(palette: any) {
        await this.paletteModel.findOneAndUpdate(
            { barcode: palette.barcode },
            palette,
            { upsert: true }
        ).exec()
    }

    async computeAmount(productName: any) {
        //all paletteStored for product
        const paletteStoredList: any[] = await this.buildEventModel.find(
            {
                eventType: 'paletteStored',
                'payload.product': productName
            }
        ).exec();

        let sum = 0;
        for (const e of paletteStoredList) {
            sum = sum + e.payload.amount;
        }

        //minus picked orders?

        return sum;
    }

    publish(newEvent: BuildEvent) {
        const oldUrls = this.subscriberUrls;
        this.subscriberUrls = [];
        for (let subscriberUrl of oldUrls) {
            this.httpService.post(subscriberUrl, newEvent).subscribe(
                (response) => {
                    console.log('Warehouse builder service publish post response is \n' + JSON.stringify(response.data, null, 3))
                    this.subscriberUrls.push(subscriberUrl);
                },
                (error) => {
                    console.log(`build service publish error: \n` + JSON.stringify(error, null, 3));
                }
            );
        }
    }

    
    async handlePickDone(params: any) {
        //update palette
        const pal = await this.paletteModel.findOneAndUpdate(
            { location: params.location },
            {
                $inc: { amount: -1 }
            },
            { new: true }
        ).exec();
        this.logger.log(`handlePickDone new pal\n${JSON.stringify(pal, null, 3)}`)

        // update pickTask
        const pick = await this.pickTaskModel.findOneAndUpdate(
            { code: params.taskCode},
            {
                palette: pal.barcode,
                state: 'shipping'
            },
            { new: true }
        ).exec()

        // publish change
        const event = {
            blockId: pick.code,
            time: new Date().toISOString(),
            eventType: 'orderPicked',
            tags: ['orders', pick.code],
            payload: {
                code: pick.code,
                state: pick.state
            }
        };

        const storeSuccess = await this.store(event);
        this.publish(event);
        
      }

    async handleSubscription(subscription: subscription) {
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

    async handleProductOrdered(event: BuildEvent) {
        const storeSuccess = await this.store(event);
        if(storeSuccess) {
            const params = event.payload;
            const productPalettes = await this.paletteModel.find({product: params.product}).exec();
            // console.log(`builder service handleProductOrdered productPalettes \n`
            // + `params ${JSON.stringify(params, null, 3)} \n `
            // + `${JSON.stringify(productPalettes, null, 3)}`)
            const locations: string[] = []
            for (const pal of productPalettes) {
                locations.push(pal.location);
            }
            const pickTask = {
                code: params.code,
                product: params.product,
                address: params.customer + ', ' + params.address,
                locations: locations,
                state: 'order placed',
            }
            const result = this.pickTaskModel.findOneAndUpdate(
                { code: params.code },
                pickTask,
                {upsert: true, new: true}
            ).exec()
        }
        return 200;
    }

    async clear() {
        return await this.buildEventModel.remove();
    }
}

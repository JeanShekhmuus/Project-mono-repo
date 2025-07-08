import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { CustomerSchema } from './customer.schema';
import { OrderSchema } from './orders.schema';
import { ProductSchema } from './product.schema';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: 'eventStore', schema: BuildEventSchema },
            { name: 'products', schema: ProductSchema },
            { name: 'orders', schema: OrderSchema },
            { name: 'customers', schema: CustomerSchema },
        ]),
    ],
    providers: [BuilderService],
    exports: [BuilderService],
})
export class BuilderModule {}

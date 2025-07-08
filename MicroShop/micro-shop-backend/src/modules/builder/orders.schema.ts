import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Order {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    product: string;

    @Prop({ required: true })
    customer: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    state: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
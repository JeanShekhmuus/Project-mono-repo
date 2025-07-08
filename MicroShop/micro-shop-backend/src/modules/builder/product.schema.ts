import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class MSProduct {
    @Prop({ required: true })
    product: string;

    @Prop({ required: true })
    amount: number = 0;

    @Prop({ required: true })
    amountTime: string;

    @Prop()
    price: string;
}

export const ProductSchema = SchemaFactory.createForClass(MSProduct);
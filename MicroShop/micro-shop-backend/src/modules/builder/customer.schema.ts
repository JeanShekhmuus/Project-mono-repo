import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Customer {

    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    name: string;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
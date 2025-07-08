import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class PickTask {
    @Prop({ required: true})
    code: string;

    @Prop({ required: true})
    product: string;

    @Prop({ required: true})
    address: string;

    @Prop({ required: true})
    palette: string;

    @Prop({ required: true})
    state: string;
    
    @Prop({ required: true})
    location: string;
}
export const PickTaskSchema = SchemaFactory.createForClass(PickTask);
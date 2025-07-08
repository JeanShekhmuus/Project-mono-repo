import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Palette {
    @Prop({ required: true})
    barcode: string;

    @Prop({ required: true})
    product: string;

    @Prop({ required: true})
    amount: number;

    @Prop({ required: true})
    location: string;
    
}
export const PaletteSchema = SchemaFactory.createForClass(Palette); 
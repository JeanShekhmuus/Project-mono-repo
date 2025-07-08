import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditOfferComponent } from './edit-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    EditOfferComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ]
})
export class EditOfferModule { }

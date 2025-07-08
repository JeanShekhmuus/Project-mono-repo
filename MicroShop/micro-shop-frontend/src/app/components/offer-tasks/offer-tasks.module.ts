import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferTasksComponent } from './offer-tasks.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    OfferTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
  ]
})
export class OfferTasksModule { }

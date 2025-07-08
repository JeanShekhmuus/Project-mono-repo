import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './components/home/home.module';
import { OfferTasksModule } from './components/offer-tasks/offer-tasks.module';
import { EditOfferModule } from './components/edit-offer/edit-offer.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule, ToastService } from 'ng-bootstrap-ext';
import { OrderModule } from './components/order/order.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HomeModule,
    OfferTasksModule,
    EditOfferModule,
    OrderModule,
    NgbModule,
    ToastModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }

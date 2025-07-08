import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOfferComponent } from './components/edit-offer/edit-offer.component';
import { HomeComponent } from './components/home/home.component';
import { OfferTasksComponent } from './components/offer-tasks/offer-tasks.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: 'home/order/:product', component: OrderComponent },
  { path: 'home/:customer', component: HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'offer-tasks/edit-offer', component: EditOfferComponent },
  { path: 'offer-tasks', component: OfferTasksComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreTasksComponent } from './store-tasks.component';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    StoreTasksComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
  ]
})
export class StoreTasksModule { }

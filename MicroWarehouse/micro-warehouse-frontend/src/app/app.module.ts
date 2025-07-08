import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPaletteModule } from './components/add-palette/add-palette.module';
import { HomeModule } from './components/home/home.module';
import { StoreTasksModule } from './components/store-tasks/store-tasks.module';
import { PickTasksModule } from './components/pick-tasks/pick-tasks.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AddPaletteModule,
    HomeModule,
    StoreTasksModule,
    HttpClientModule,
    PickTasksModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

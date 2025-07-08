import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPaletteComponent } from './add-palette.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    AddPaletteComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ]
})
export class AddPaletteModule { }

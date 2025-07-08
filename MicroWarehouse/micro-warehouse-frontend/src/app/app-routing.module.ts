import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaletteComponent } from './components/add-palette/add-palette.component';
import { HomeComponent } from './components/home/home.component';
import { PickTasksComponent } from './components/pick-tasks/pick-tasks.component';
import { StoreTasksComponent } from './components/store-tasks/store-tasks.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'store-tasks', component: StoreTasksComponent},
  { path: 'store-tasks/add-palette', component: AddPaletteComponent},
  { path: 'pick-tasks', component: PickTasksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

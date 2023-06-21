import { NgModule } from '@angular/core';
import { InitialInfoComponent } from './initial-info.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule } from 'primeng/primeng';

const routes: Routes = [
  { path: ':token', component: InitialInfoComponent }
]


@NgModule({
  declarations: [
    InitialInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,  
    DataTableModule,
    SharedModule,
    TabViewModule,
    DropdownModule,
    GrowlModule,  
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class InitialInfoModule { }

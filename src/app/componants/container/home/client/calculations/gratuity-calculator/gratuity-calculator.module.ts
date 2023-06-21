import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarModule, GrowlModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingModule } from '../../../../../error-handling/error-handling.module'

const routes: Routes = []


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CalendarModule,
    ErrorHandlingModule,
    GrowlModule

  ],
  providers: [
  ],
  exports: [

  ]
})
export class GratuityCalculatorModule { }


import { NgModule } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, GrowlModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    DatePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    GrowlModule,
  ],
  providers: [
  ],
  exports: [
    DatePickerComponent
  ]
})
export class DatePickerModule { }

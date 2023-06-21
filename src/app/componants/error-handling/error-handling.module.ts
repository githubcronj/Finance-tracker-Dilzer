import { NgModule } from '@angular/core';
import { ErrorHandlingComponent } from './error-handling.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ErrorHandlingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  exports: [
    ErrorHandlingComponent
  ]
})
export class ErrorHandlingModule { }

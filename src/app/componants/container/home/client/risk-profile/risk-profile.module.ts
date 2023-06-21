import { NgModule } from '@angular/core';
 import { RiskProfileComponent } from './risk-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module'


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorHandlingModule,
  ],
  providers: [
  ],
  exports: [
  ]
})
export class RiskProfileModule { }

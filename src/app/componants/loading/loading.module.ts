import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  exports: [
    LoadingComponent
  ]
})
export class LoadingModule { }

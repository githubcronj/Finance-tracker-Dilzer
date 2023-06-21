import { NgModule } from '@angular/core';
import { ResetpasswordComponent } from './reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: ':token', component: ResetpasswordComponent }
]


@NgModule({
  declarations: [
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
})
export class ResetpasswordModule { }

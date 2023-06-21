import { NgModule } from '@angular/core';
import { PaymentSuccessComponent } from './success/payment-success.component';
import { PaymentFailureComponent } from './failure/payment-failure.component';
import { PaymentComponent } from './payment.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



const routes: Routes = [
  { path: 'success', component: PaymentSuccessComponent },
  { path: 'failure', component: PaymentFailureComponent },
  { path: ':token', component: PaymentComponent }

]


@NgModule({
  declarations: [
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent
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
export class PaymentModule { }

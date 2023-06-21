import { NgModule } from '@angular/core';
import { CommittedRepaymentComponent } from './committed-repayment.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { CalendarModule, GrowlModule, TooltipModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'
import { DatePickerModule } from '../date-picker/date-picker.module'

const routes: Routes = [
  { path: '', component: CommittedRepaymentComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    CommittedRepaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    CalendarModule,
    GrowlModule,
    ErrorHandlingModule,
    DatePickerModule,
    TooltipModule
  ],
  providers: [
  ],
})
export class CommittedRepaymentModule { }

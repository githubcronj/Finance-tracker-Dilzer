import { NgModule } from '@angular/core';
import { AddGoalComponent } from './add-goal.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { GrowlModule, TooltipModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'
import { DatePickerModule } from '../date-picker/date-picker.module'


const routes: Routes = [
  { path: '', component: AddGoalComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    AddGoalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    GrowlModule,
    ErrorHandlingModule,
    DatePickerModule,
    TooltipModule
  ],
  providers: [
  ],
})
export class AddGoalModule { }

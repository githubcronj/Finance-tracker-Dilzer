import { NgModule } from '@angular/core';
import { AddLiabilitiesComponent } from './add-liabilities.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { CalendarModule, GrowlModule, TooltipModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'


const routes: Routes = [
  { path: '', component: AddLiabilitiesComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    AddLiabilitiesComponent,
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
    TooltipModule
  ],
  providers: [
  ],
})
export class AddLiabilitiesModule { }

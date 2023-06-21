import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecreaseInEmiComponent } from './decrease-in-emi.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { CalendarModule, GrowlModule, TooltipModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: DecreaseInEmiComponent, canActivate: [AuthGuardService] }
]

@NgModule({
  declarations: [
    DecreaseInEmiComponent
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

export class DecreaseInEmiModule { }

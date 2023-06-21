import { NgModule } from '@angular/core';
import { SpouseInfoComponent } from './spouse-info.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { GrowlModule, CalendarModule } from 'primeng/primeng';
import { NavbarModule } from '../navbar/navbar.module';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: SpouseInfoComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    SpouseInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GrowlModule,
    CalendarModule,
    NavbarModule,
    ErrorHandlingModule,
  ],
  providers: [
  ],
})
export class SpouseInfoModule { }

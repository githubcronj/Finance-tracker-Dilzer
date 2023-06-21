import { NgModule } from '@angular/core';
import { LiabilityComponent } from './liability.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { GrowlModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: LiabilityComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    LiabilityComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    GrowlModule,
    ErrorHandlingModule,
  ],
  providers: [
  ],
})
export class LiabilityModule { }

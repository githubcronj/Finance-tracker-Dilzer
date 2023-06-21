import { NgModule, forwardRef, Inject } from '@angular/core';
import { SoleSurvivorExpenseComponent } from './sole-survivor-expense.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { GrowlModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: SoleSurvivorExpenseComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    SoleSurvivorExpenseComponent,
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
  exports: [
    SoleSurvivorExpenseComponent
  ]
})
export class SoleSurvivorExpenseModule { }

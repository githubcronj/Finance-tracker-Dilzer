import { NgModule, forwardRef, Inject } from '@angular/core';
import { AddSoleSurvivorComponent } from './add-sole-survivor.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { CalendarModule, GrowlModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'


const routes: Routes = [
  { path: '', component: AddSoleSurvivorComponent, canActivate: [AuthGuardService] }
]

@NgModule({
  declarations: [
    AddSoleSurvivorComponent,
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
    
  ],
  providers: [
  ],
})

export class SoleSurvivorModule { }

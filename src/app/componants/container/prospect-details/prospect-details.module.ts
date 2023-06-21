import { NgModule } from '@angular/core';
import { ProspectDetailsComponent } from './prospect-details.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { GrowlModule } from 'primeng/primeng';
import { NavbarModule } from '../navbar/navbar.module';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: ProspectDetailsComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    ProspectDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GrowlModule,
    NavbarModule,
    ErrorHandlingModule
  ],
  providers: [
  ],
})
export class ProspectDetailsModule { }

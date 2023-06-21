import { NgModule } from '@angular/core';
import { UpdateAccountComponent } from './update-account.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';

const routes: Routes = [
  { path: '', component: UpdateAccountComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    UpdateAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule
    
  ],
  providers: [
  ],
})
export class UpdateAccountModule { }

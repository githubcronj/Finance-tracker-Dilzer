import { NgModule } from '@angular/core';
import { InviteAdminComponent } from './invite-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';

const routes: Routes = [
  { path: '', component: InviteAdminComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    InviteAdminComponent,
    
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
export class InviteAdminModule { }

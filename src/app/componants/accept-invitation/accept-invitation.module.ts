import { NgModule } from '@angular/core';
import { AcceptInvitationComponent } from './accept-invitation.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

const routes: Routes = [
  { path: '', component: AcceptInvitationComponent }
]


@NgModule({
  declarations: [
    AcceptInvitationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  providers: [
  ],
})
export class AcceptInvitationModule { }

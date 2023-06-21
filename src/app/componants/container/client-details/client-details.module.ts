import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { MatTabsModule } from '@angular/material';
import { ClientHomeModule } from '../home/client/client-home.module';
import { ClientDetailsComponent } from './client-details.component';

const routes: Routes = [
  {
    path: '', component: ClientDetailsComponent, canActivate: [AuthGuardService]
  }
]


@NgModule({
  declarations: [
    ClientDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CalendarModule,
    DataTableModule,
    SharedModule,
    TabViewModule,
    DropdownModule,
    GrowlModule,
    MatTabsModule,
    ClientHomeModule
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ClientDetailsModule { }

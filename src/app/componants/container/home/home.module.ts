import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule, TooltipModule } from 'primeng/primeng';
import { AdminHomeComponent } from './admin/admin-home.component';
import { MatTabsModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientComponent } from './admin/client.component';
import { TeamComponent } from './admin/team.component';
import { ClientHomeModule } from './client/client-home.module';
import { TableModule } from 'primeng/table';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module';


const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardService]
  }
]


@NgModule({
  declarations: [
    HomeComponent,
    AdminHomeComponent,
    ClientComponent,
    TeamComponent
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
    ClientHomeModule,
    TooltipModule,
    MatDialogModule,
    TableModule,
    ErrorHandlingModule
  ],
  providers: [
  ],
  exports: [
  ]
})
export class HomeModule { }

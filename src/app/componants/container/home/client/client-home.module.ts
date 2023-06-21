import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { MatTabsModule } from '@angular/material';
import { InformationComponent } from './information.component';
import { ClientHomeComponent } from './client-home.component';
import { GoalsModule } from './goals/goals.module';
import { ErrorHandlingModule } from '../../../error-handling/error-handling.module'
import { NetworthModule } from './networth/networth.module';
import { CashflowModule } from './cashflow/cashflow.module';
import { RiskProfileQuestionsModule } from './risk-profile-questions/risk-profile-questions.module';


import { CalculationsModule } from './calculations/calculations.module';
import { NavbarModule } from '../../navbar/navbar.module';

const routes: Routes = []


@NgModule({
  declarations: [
    ClientHomeComponent,
    InformationComponent
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
    NavbarModule,
    ErrorHandlingModule,
    NetworthModule,
    CashflowModule,
    GoalsModule,
    RiskProfileQuestionsModule,
    CalculationsModule
  ],
  providers: [
  ],
  exports: [
    ClientHomeComponent,
    InformationComponent
  ]
})
export class ClientHomeModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressBarModule, CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule, DragDropModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalsComponent } from './goals.component';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module'
import { GoalFundingComponent } from './goal-funding/goal-funding.component';
import { NavbarModule } from '../../../navbar/navbar.module';
import { SideMenuModule } from '../../../sidemenu/sidemenu.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { GoalCostComponent } from './goal-cost/goal-cost.component';
import { MatMenuModule } from '@angular/material/menu';
import { GoalFundingViewModel } from './goal-funding/goal-funding-view-model';
import { GoalRepository } from '../../../../../repository/goal/goal.repository';
import { ScenarioAnalysisModule } from './scenario-analysis/scenario-analysis.module';
import { UserRepository } from '../../../../../repository/user/user.repository';
import { GoalsListComponent } from './goals-list/goals-list.component';
import { GoalsListViewModel } from './goals-list/goals-list-view-model';
import { TableModule } from 'primeng/table';

const routes: Routes = []


@NgModule({
  declarations: [
    GoalsComponent,
    GoalFundingComponent,
    GoalCostComponent,
    GoalsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    ErrorHandlingModule,
    DataTableModule,
    SharedModule,
    TabViewModule,
    DropdownModule,
    GrowlModule,
    SideMenuModule,
    MatSidenavModule,
    ProgressBarModule,
    DragDropModule,
    MatDialogModule,
    MatMenuModule,
    ScenarioAnalysisModule,
    TableModule
  ],
  providers: [
    GoalFundingViewModel,
    GoalRepository,
    UserRepository,
    GoalsListViewModel
  ],
  exports: [
    GoalsComponent,
    GoalFundingComponent,
    GoalCostComponent,
    GoalsListComponent
  ]
})
export class GoalsModule { }


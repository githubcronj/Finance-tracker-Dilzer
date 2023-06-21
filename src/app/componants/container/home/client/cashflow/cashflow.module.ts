import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CashflowComponent } from './cashflow.component';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SavingsComponent } from './savings/savings.component';
import { RepaymentsComponent } from './repayments/repayments.component';
import { NavbarModule } from '../../../navbar/navbar.module';
import { SideMenuModule } from '../../../sidemenu/sidemenu.module';
import { ChartModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DashboardViewModel } from './dashboard/dashboard-view-model';
import { UserRepository } from '../../../../../repository/user/user.repository'
import { CashflowRepository } from '../../../../../repository/cashflow/cashflow.repository';
import { IncomeCategoryViewModel } from './income-category/income-category-view-model';
import { IncomeCategoryComponent } from './income-category/income-category.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { ExpenseCategoryViewModel } from './expense-category/expense-category-view-model';
import { IncomesComponent } from './incomes/incomes.component';
import { IncomeCategoryNavigatorComponent } from './income-category-navigator/income-category-navigator.component'
import { IncomesListViewModel } from './incomes/incomes-list-view-model';


const routes: Routes = []


@NgModule({
  declarations: [
    CashflowComponent,
    DashboardComponent,
    SavingsComponent,
    RepaymentsComponent,
    IncomeCategoryComponent,
    ExpenseCategoryComponent,
    IncomesComponent,
    IncomeCategoryNavigatorComponent
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
    ChartModule,
    TableModule
  ],
  providers: [
    DashboardViewModel,
    UserRepository,
    CashflowRepository,
    IncomeCategoryViewModel,
    ExpenseCategoryViewModel,
    IncomesListViewModel
  ],
  exports: [
    CashflowComponent,
    DashboardComponent,
    SavingsComponent,
    RepaymentsComponent,
    IncomesComponent,
    IncomeCategoryNavigatorComponent
  ]
})
export class CashflowModule { }


import { NgModule, forwardRef } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarModule, DataTableModule, SharedModule, TabViewModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworthComponent } from './networth.component';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'primeng/primeng';
import { NetworthRepository } from '../../../../../repository/networth/networth.repository';
import { DashboardViewModel } from './dashboard/dashboard-view-model';
import { AssetCategoryViewModel } from './asset-category/asset-category-view-model';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetCategoryNavigatorComponent } from './asset-category-navigator/asset-category-navigator.component'
import { AssetsComponent } from './assets/assets.component';
import { AssetsViewModel } from './assets/assets-view-model';
import { LiabilityCategoryNavigatorComponent } from './liability-category-navigator/liability-category-navigator.component'
import { LiabilitiesCategoryViewModel } from './liabilities-category/liabilities-category-view-model';
import { LiabilitiesCategoryComponent } from './liabilities-category/liabilities-category.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { LiabilitiesViewModel } from './liabilities/liabilities-view-model';

import { NavbarModule } from '../../../navbar/navbar.module';
import { SideMenuModule } from '../../../sidemenu/sidemenu.module';
import { TableModule } from 'primeng/table';
import { UserRepository } from '../../../../../repository/user/user.repository'

const routes: Routes = []


@NgModule({
  declarations: [
    NetworthComponent,
    DashboardComponent,
    AssetCategoryComponent,
    AssetCategoryNavigatorComponent,
    AssetsComponent,
    LiabilityCategoryNavigatorComponent,
    LiabilitiesCategoryComponent,
    LiabilitiesComponent
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
    NetworthRepository,
    DashboardViewModel,
    UserRepository,
    AssetCategoryViewModel,
    AssetsViewModel,
    LiabilitiesCategoryViewModel, 
    LiabilitiesViewModel

  ],
  exports: [
    NetworthComponent,
    AssetCategoryComponent,
    DashboardComponent,
    AssetCategoryNavigatorComponent,
    AssetsComponent,
    LiabilityCategoryNavigatorComponent,
    LiabilitiesCategoryComponent,
    LiabilitiesComponent
  ]
})
export class NetworthModule { }


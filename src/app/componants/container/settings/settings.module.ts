import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTableModule, TabViewModule, GrowlModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'
import { NavbarModule } from '../navbar/navbar.module';
import { SideMenuModule } from '../sidemenu/sidemenu.module';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { AssetClassSettingComponent } from './assetClassSetting/assetClassSetting.component';
import { RiskProfileSettingComponent } from './riskProfileSetting/riskProfileSetting.component';
import { SettingsRepository } from '../../../repository/settings/settings.repository';
import { RiskProfileSettingViewModel } from './riskProfileSetting/risk-profile-setting-view-model';

const routes: Routes = [
  { path: '', component: SettingsComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    SettingsComponent,
    AssetClassSettingComponent,
    RiskProfileSettingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    ErrorHandlingModule,
    DataTableModule,
    TabViewModule,
    GrowlModule,
    SideMenuModule
  ],
  providers: [
    SettingsRepository,
    RiskProfileSettingViewModel
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }


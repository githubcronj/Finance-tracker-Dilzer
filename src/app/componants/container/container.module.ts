import { NgModule, forwardRef, Inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ContainerComponent } from './container.component';
import { AuthGuardService } from '../../services/authGuards/authGuard.service';
import { ChangePasswordModule } from './change-password/change-password.module';
import { HomeModule } from './home/home.module';
import { UpdateAccountModule } from './update-account/update-account.module';
import { ProspectDetailsModule } from './prospect-details/prospect-details.module';
import { InviteAdminModule } from './invite-admin/invite-admin.module';
import { PersonalInfoModule } from './personal-info/personal-info.module';
import { SpouseInfoModule } from './spouse-info/spouse-info.module';
import { DependentsModule } from './dependents/dependents.module';
import { ClientDetailsModule } from './client-details/client-details.module';
import { AddAssetsModule } from './add-assets/add-assets.module';
import { AssetModule } from './asset/asset.module';
import { CommittedSavingModule } from './committed-saving/committed-saving.module';
import { RateOfReturnModule } from './rate-of-return/rate-of-return.module';
import { GoalCorpusRateOfReturnModule } from './goal-corpus-rate-of-return/goal-corpus-rate-of-return.module'
import { CurrentAssetAllocationModule } from './asset-allocation/current-asset-allocation/current-asset-allocation.module';
import { DesiredAssetAllocationModule } from './asset-allocation/desired-asset-allocation/desired-asset-allocation.module';
import { InsuranceModule } from './insurance/insurance.module'
import { AddExpenseModule } from './add-expense/add-expense.module';
import { AddGoalModule } from './add-goal/add-goal.module';
import { GoalModule } from './goal/goal.module';
import { SoleSurvivorModule } from './add-sole-survivor/add-sole-survivor.module';
import { SoleSurvivorExpenseModule } from './sole-survivor-expense/sole-survivor-expense.module';
import { SoleSurvivorService } from '../../services/soleSurvivor.service';
import { SettingsModule } from './settings/settings.module';



const routes: Routes = [
  {
    path: '', component: ContainerComponent,
    children: [
      { path: 'home', loadChildren: 'app/componants/container/home/home.module#HomeModule' },
      { path: 'admin/prospect-details/:clientId', loadChildren: 'app/componants/container/prospect-details/prospect-details.module#ProspectDetailsModule' },
      { path: 'admin/client-details/:clientId', loadChildren: 'app/componants/container/client-details/client-details.module#ClientDetailsModule', canActivate: [AuthGuardService] },
      { path: 'change-password', loadChildren: 'app/componants/container/change-password/change-password.module#ChangePasswordModule' },
      { path: 'update-account', loadChildren: 'app/componants/container/update-account/update-account.module#UpdateAccountModule' },
      { path: 'admin/invite', loadChildren: 'app/componants/container/invite-admin/invite-admin.module#InviteAdminModule' },
      { path: 'admin/:adminId', loadChildren: 'app/componants/container/invite-admin/invite-admin.module#InviteAdminModule' },
      { path: 'client/:clientId/personal-info', loadChildren: 'app/componants/container/personal-info/personal-info.module#PersonalInfoModule', canActivate: [AuthGuardService] },
      { path: 'client/:clientId/spouse-info', loadChildren: 'app/componants/container/spouse-info/spouse-info.module#SpouseInfoModule', canActivate: [AuthGuardService] },
      { path: 'client/:clientId/family-member', loadChildren: 'app/componants/container/dependents/dependents.module#DependentsModule', canActivate: [AuthGuardService] },
      { path: 'client/:clientId/family-member/:familyId', loadChildren: 'app/componants/container/dependents/dependents.module#DependentsModule', canActivate: [AuthGuardService] },
      { path: 'client/:clientId/add-asset', loadChildren: 'app/componants/container/add-assets/add-assets.module#AddAssetsModule' },
      { path: 'client/:clientId/asset/:assetId', loadChildren: 'app/componants/container/asset/asset.module#AssetModule' },
      { path: 'client/:clientId/edit-asset/:assetId', loadChildren: 'app/componants/container/add-assets/add-assets.module#AddAssetsModule' },
      { path: 'client/:clientId/asset/:assetId/committed-saving', loadChildren: 'app/componants/container/committed-saving/committed-saving.module#CommittedSavingModule' },
      { path: 'client/:clientId/asset/:assetId/committed-saving/:committedId', loadChildren: 'app/componants/container/committed-saving/committed-saving.module#CommittedSavingModule' },
      { path: 'client/:clientId/asset/:assetId/rateOfReturn', loadChildren: 'app/componants/container/rate-of-return/rate-of-return.module#RateOfReturnModule' },
      { path: 'client/:clientId/asset/:assetId/rateOfReturn/:rateOfReturnId', loadChildren: 'app/componants/container/rate-of-return/rate-of-return.module#RateOfReturnModule' },
      { path: 'client/:clientId/asset/:assetId/currentAssetAllocation', loadChildren: 'app/componants/container/asset-allocation/current-asset-allocation/current-asset-allocation.module#CurrentAssetAllocationModule' },
      { path: 'client/:clientId/asset/:assetId/desiredAssetAllocation', loadChildren: 'app/componants/container/asset-allocation/desired-asset-allocation/desired-asset-allocation.module#DesiredAssetAllocationModule' },
      { path: 'client/:clientId/asset/:assetId/insurance', loadChildren: 'app/componants/container/insurance/insurance.module#InsuranceModule' },
      { path: 'client/:clientId/asset/:assetId/survival-benefit', loadChildren: 'app/componants/container/survival-benefit/survival-benefit.module#SurvivalBenefitModule' },
      { path: 'client/:clientId/asset/:assetId/survival-benefit/:survivalBenefitId', loadChildren: 'app/componants/container/survival-benefit/survival-benefit.module#SurvivalBenefitModule' },
      { path: 'client/:clientId/add-liability', loadChildren: 'app/componants/container/add-liabilities/add-liabilities.module#AddLiabilitiesModule' },
      { path: 'client/:clientId/liability/:liabilityId', loadChildren: 'app/componants/container/liability/liability.module#LiabilityModule' },
      { path: 'client/:clientId/edit-liability/:liabilityId', loadChildren: 'app/componants/container/add-liabilities/add-liabilities.module#AddLiabilitiesModule' },
      { path: 'client/:clientId/liability/:liabilityId/current-stage', loadChildren: 'app/componants/container/loan-stage/loan-stage.module#LoanStageModule' },
      { path: 'client/:clientId/liability/:liabilityId/loan-revision', loadChildren: 'app/componants/container/loan-revision/loan-revision.module#LoanRevisionModule' },
      { path: 'client/:clientId/liability/:liabilityId/decrease-emi', loadChildren: 'app/componants/container/decrease-in-emi/decrease-in-emi.module#DecreaseInEmiModule' },
      
      { path: 'client/:clientId/liability/:liabilityId/committed-repayment', loadChildren: 'app/componants/container/committed-repayment/committed-repayment.module#CommittedRepaymentModule' },
      { path: 'client/:clientId/liability/:liabilityId/committed-repayment/:committedId', loadChildren: 'app/componants/container/committed-repayment/committed-repayment.module#CommittedRepaymentModule' },
      { path: 'client/:clientId/add-income', loadChildren: 'app/componants/container/add-income/add-income.module#AddIncomeModule' },
      { path: 'client/:clientId/add-expenses', loadChildren: 'app/componants/container/add-expense/add-expense.module#AddExpenseModule' },
      { path: 'client/:clientId/add-goal', loadChildren: 'app/componants/container/add-goal/add-goal.module#AddGoalModule' },
      { path: 'client/:clientId/edit-goal/:goalId', loadChildren: 'app/componants/container/add-goal/add-goal.module#AddGoalModule' },
      { path: 'client/:clientId/goal/:goalId', loadChildren: 'app/componants/container/goal/goal.module#GoalModule' },
      { path: 'client/:clientId/income/:incomeId', loadChildren: 'app/componants/container/income/income.module#IncomeModule' },
      { path: 'client/:clientId/edit-income/:incomeId', loadChildren: 'app/componants/container/add-income/add-income.module#AddIncomeModule' },
      { path: 'client/:clientId/goal/:goalId/goalCorpusRateOfReturn', loadChildren: 'app/componants/container/goal-corpus-rate-of-return/goal-corpus-rate-of-return.module#GoalCorpusRateOfReturnModule' },
      { path: 'client/:clientId/goal/:goalId/goalCorpusRateOfReturn/:goalCorpusRateOfReturnId', loadChildren: 'app/componants/container/goal-corpus-rate-of-return/goal-corpus-rate-of-return.module#GoalCorpusRateOfReturnModule' },
      { path: 'client/:clientId/edit-expenses/:expenseId', loadChildren: 'app/componants/container/add-expense/add-expense.module#AddExpenseModule' },
      { path: 'client/:clientId/goal/:goalId/sole-survivor', loadChildren: 'app/componants/container/add-sole-survivor/add-sole-survivor.module#SoleSurvivorModule' },
      { path: 'client/:clientId/goal/:goalId/retirement/sole-survior-expenses', loadChildren: 'app/componants/container/sole-survivor-expense/sole-survivor-expense.module#SoleSurvivorExpenseModule' },

      { path: 'settings', loadChildren: 'app/componants/container/settings/settings.module#SettingsModule' },

    ], canActivate: [AuthGuardService]
  }
]


@NgModule({
  declarations: [
    HeaderComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    SoleSurvivorService
  ],
  exports: [
  ]
})
export class ContainerModule { }

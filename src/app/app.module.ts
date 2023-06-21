import { BrowserModule } from '@angular/platform-browser';
import { NgModule, forwardRef, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FooterComponent } from './componants/footer/footer.component';
import { PageNotFoundComponent } from './componants/page-not-found/page-not-found.component';
import { ResourcesService } from './services/resources.service';
import { ValidationService } from './services/validation.service';
import { LoginModule } from './componants/login/login.module';
import { RegistrationModule } from './componants/registration/registration.module';
import { ForgotPasswordModule } from './componants/forgot-password/forgot-password.module';
import { ResetpasswordModule } from './componants/reset-password/reset-password.module';
import { AcceptInvitationModule } from './componants/accept-invitation/accept-invitation.module';
import { InitialInfoModule } from './componants/initial-info/initial-info.module';
import { ContainerModule } from './componants/container/container.module';
import { KeychainService } from './services/keychain.service';
import { PaymentModule } from './componants/billing/payment.module';
import { HttpService } from './services/http.service';
import { AuthGuardService } from './services/authGuards/authGuard.service';
import { FinanceService } from './services/finance.service';
import { FormatterService } from './services/formatter.service';
import { Safe } from './services/safe-html.pipe';
import { ActivityLogComponent } from './componants/container/activity-log/activity-log.component';
import { AssetBreakdownComponent } from './componants/container/home/client/calculations/emergency-fund-analysis/asset-breakdown/asset-breakdown.component';
import { ExpenseBreakdownComponent } from './componants/container/home/client/calculations/emergency-fund-analysis/expense-breakdown/expense-breakdown.component';
import { LiabilityBreakdownComponent } from './componants/container/home/client/calculations/emergency-fund-analysis/liability-breakdown/liability-breakdown.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { ChartModule } from 'primeng/primeng';
import { RiskProfileComponent } from './componants/container/home/client/risk-profile/risk-profile.component';
import { ErrorHandlingModule } from './componants/error-handling/error-handling.module'
import { LoadingModule } from './componants/loading/loading.module';
import { GrowlModule } from 'primeng/primeng';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from './services/message.service';
import { ClientInfoComponent } from './componants/container/home/admin/client-info/client-info.component';
import { AssetBreakupComponent } from './componants/container/home/client/goals/goal-funding/asset-breakup/asset-breakup.component';
import { GoalCorpusBreakupComponent } from './componants/container/home/client/goals/goal-funding/goal-corpus-breakup/goal-corpus-breakup.component';
import { BreakUpComponent } from './componants/container/home/client/calculations/financial-ratio-calculator/breakup-component/breakup-component.component';



const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: "app/componants/container/container.module#ContainerModule" },
  { path: 'payment', loadChildren: "app/componants/billing/payment.module#PaymentModule" },
  { path: 'login', loadChildren: "app/componants/login/login.module#LoginModule" },
  { path: 'register', loadChildren: "app/componants/registration/registration.module#RegistrationModule" },
  { path: 'forgot-password', loadChildren: "app/componants/forgot-password/forgot-password.module#ForgotPasswordModule" },
  { path: 'reset-password', loadChildren: "app/componants/reset-password/reset-password.module#ResetpasswordModule" },
  { path: 'initial-info', loadChildren: "app/componants/initial-info/initial-info.module#InitialInfoModule" },
  { path: 'admin/accept-invitation/:token', loadChildren: "app/componants/accept-invitation/accept-invitation.module#AcceptInvitationModule" },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ActivityLogComponent,
    PageNotFoundComponent,
    RiskProfileComponent,
    Safe,
    AssetBreakdownComponent,
    ExpenseBreakdownComponent,
    LiabilityBreakdownComponent,
    BreakUpComponent,
    ClientInfoComponent,
    AssetBreakupComponent,
    GoalCorpusBreakupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    ChartModule,
    LoadingModule,
    ErrorHandlingModule,
    GrowlModule,
    NoopAnimationsModule
  ],
  providers: [
    ResourcesService,
    ValidationService,
    KeychainService,
    HttpService,
    AuthGuardService,
    FinanceService,
    FormatterService,
    MessageService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ActivityLogComponent,
    RiskProfileComponent,
    AssetBreakdownComponent,
    ExpenseBreakdownComponent,
    LiabilityBreakdownComponent,
    ClientInfoComponent,
    AssetBreakupComponent,
    BreakUpComponent,
    GoalCorpusBreakupComponent
  ]

})
export class AppModule { }

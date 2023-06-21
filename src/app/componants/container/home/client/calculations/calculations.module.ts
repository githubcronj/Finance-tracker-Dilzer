import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculationsComponent } from './calculations.component';
import { NavbarModule } from '../../../navbar/navbar.module';
import { SideMenuModule } from '../../../sidemenu/sidemenu.module';
import { GratuityCalculatorComponent } from './gratuity-calculator/gratuity-calculator.component';
import { GratuityCalculatorModule } from './gratuity-calculator/gratuity-calculator.module';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module';
import { CalendarModule, GrowlModule } from 'primeng/primeng';
import { GratuityCalculatorRepository } from '../../../../../repository/gratuity-calculator/gratuity-calculator.repository';
import { GratuityCalculatorViewModel } from './gratuity-calculator/gratuity-calculator-view-model';
import { EmergencyFundAnalysisModule } from './emergency-fund-analysis/emergency-fund-analysis.module';
import { FinancialRatioCalculatorComponent } from './financial-ratio-calculator/financial-ratio-calculator.component';
import { FinancialRatioCalculatorViewModel  } from './financial-ratio-calculator/financial-ratio-calculator-view-model'

const routes: Routes = []

@NgModule({
  declarations: [
    CalculationsComponent,
    GratuityCalculatorComponent,
    FinancialRatioCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    ErrorHandlingModule,
    SideMenuModule,
    CalendarModule,
    GrowlModule,
    EmergencyFundAnalysisModule,

  ],
  providers: [
    GratuityCalculatorRepository,
    GratuityCalculatorViewModel,
    FinancialRatioCalculatorViewModel,

  ],
  exports: [
    CalculationsComponent,
    GratuityCalculatorComponent
  ]
})
export class CalculationsModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingModule } from '../../../../../error-handling/error-handling.module';
import { ScenarioAnalysisComponent } from './scenario-analysis.component';
import { GrowlModule, TooltipModule } from 'primeng/primeng';
import { DatePickerModule } from '../../../../date-picker/date-picker.module';
import { ScenarioAnalysisViewModel } from './scenario-analysis-view-model';
import { TableModule } from 'primeng/table';

const routes: Routes = []


@NgModule({
  declarations: [
    ScenarioAnalysisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ErrorHandlingModule,
    GrowlModule,
    TooltipModule,
    DatePickerModule,
    TableModule
  ],
  providers: [
    ScenarioAnalysisViewModel
  ],
  exports: [
    ScenarioAnalysisComponent
  ]
})
export class ScenarioAnalysisModule { }


import { NgModule } from '@angular/core';
import { RiskProfileQuestionsComponent } from './risk-profile-questions.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingModule } from '../../../../error-handling/error-handling.module'


@NgModule({
    declarations: [
        RiskProfileQuestionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ErrorHandlingModule,
    ],
    providers: [
    ],
    exports: [
        RiskProfileQuestionsComponent
    ]
})
export class RiskProfileQuestionsModule { }

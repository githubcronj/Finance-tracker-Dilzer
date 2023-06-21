import { NgModule } from '@angular/core';
import { EmergencyFundAnalysisComponent } from './emergency-fund-analysis.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../../../../navbar/navbar.module';
import { GrowlModule } from 'primeng/primeng';
import { ErrorHandlingModule } from '../../../../../error-handling/error-handling.module'
import { EmergencyFundViewModel } from './emergency-fund-view-model';
import { EmergencyFundRepository } from '../../../../../../repository/emergency-fund/emergency-fund.repository';
import { HttpService } from '../../../../../../services/http.service';


const routes: Routes = []


@NgModule({
    declarations: [
        EmergencyFundAnalysisComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NavbarModule,
        GrowlModule,
        ErrorHandlingModule,
    ],
    providers: [
        EmergencyFundViewModel,
        EmergencyFundRepository
    ],
    exports: [
        EmergencyFundAnalysisComponent,
    ]
})


export class EmergencyFundAnalysisModule { }

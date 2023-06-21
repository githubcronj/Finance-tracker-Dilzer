import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { Asset } from '../../../../../../model/asset/asset';
import { Liability } from '../../../../../../model/liability/liability';
import { FormatterService } from 'app/services/formatter.service';
import { EmergencyFundViewModel } from './emergency-fund-view-model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AssetBreakdownComponent } from './asset-breakdown/asset-breakdown.component'
import { ExpenseBreakdownComponent } from './expense-breakdown/expense-breakdown.component'
import { LiabilityBreakdownComponent } from './liability-breakdown/liability-breakdown.component'
import { EmergencyFundAnalysisTranslations } from './emergency-fund-analysis.translations'
import { MessageService } from '../../../../../../services/message.service';


@Component({
    selector: 'app-emergency-fund-analysis',
    templateUrl: './emergency-fund-analysis.component.html',
    styleUrls: ['./emergency-fund-analysis.component.css']
})


export class EmergencyFundAnalysisComponent implements OnInit {


    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') public errorHandling: ErrorHandlingComponent;

    public isErrorOccured = false;
    public translations = EmergencyFundAnalysisTranslations;


    constructor(
        public emergencyFundViewModel: EmergencyFundViewModel,
        private dialog: MatDialog,
        private changeDetector: ChangeDetectorRef,
        private messageService: MessageService
    ) { }


    async ngOnInit() {
        this.emergencyFundViewModel.clientId = this.clientId;
        this.getEmergencyFundDetails();
    }


    async getEmergencyFundDetails() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.emergencyFundViewModel.getEmergencyFundDetailsFromRepository();
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true;
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
        }
    }


    openDialog(component, width, height, breakup): void {
        let dialogRef = this.dialog.open(component, {
            width: width,
            height: height,
            data: breakup,
        });
    }


    didOpenExpenseBreakupDialog(breakup) {
        this.openDialog(ExpenseBreakdownComponent, '600px', '400px',breakup);
    }


    didOpenAssetBreakupDialog(breakup) {
        this.openDialog(AssetBreakdownComponent, '600px', '400px',breakup);
    }


    didOpenLiabilityBreakupDialog(breakup) {
        this.openDialog(LiabilityBreakdownComponent, '600px', '400px',breakup);
    }



    retry() {
        this.getEmergencyFundDetails();
    }

}

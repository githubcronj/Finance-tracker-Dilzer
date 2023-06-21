import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmergencyFundViewModel } from '../emergency-fund-view-model';
import { LiabilityBreakupTranslations } from './liability-breakdown.translations';
import { Inject } from '@angular/core';


@Component({
    selector: 'app-liability-breakdown',
    templateUrl: './liability-breakdown.component.html',
    styleUrls: ['./liability-breakdown.component.css']
})


export class LiabilityBreakdownComponent implements OnInit {

    public translations = LiabilityBreakupTranslations;


    constructor(
        @Inject(MAT_DIALOG_DATA) public liabilities: any,
        public dialogRef: MatDialogRef<LiabilityBreakdownComponent>,
        public emergencyFundViewModel: EmergencyFundViewModel) {
        dialogRef.disableClose = true;
    }


    ngOnInit() {
        this.emergencyFundViewModel.didRemovePadding();
    }


    didClickCloseDialog(isCalculateAmount = false) {
        if (isCalculateAmount) {
        }
        this.dialogRef.close();
    }
}
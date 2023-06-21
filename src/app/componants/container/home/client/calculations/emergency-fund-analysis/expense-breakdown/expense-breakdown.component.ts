import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmergencyFundViewModel } from '../emergency-fund-view-model';
import { ExpenseBreakupTranslations } from './expense-breakdown.translations'
import { Inject } from '@angular/core';

@Component({
    selector: 'app-expense-breakdown',
    templateUrl: './expense-breakdown.component.html',
    styleUrls: ['./expense-breakdown.component.css']
})


export class ExpenseBreakdownComponent implements OnInit {

    public translations = ExpenseBreakupTranslations;


    constructor(
        @Inject(MAT_DIALOG_DATA) public expenses: any,
        public dialogRef: MatDialogRef<ExpenseBreakdownComponent>,
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
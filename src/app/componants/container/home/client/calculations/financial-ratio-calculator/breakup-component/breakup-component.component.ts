import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { FinancialRatioCalculatorViewModel } from '../financial-ratio-calculator-view-model'


@Component({
    selector: 'breakup-component',
    templateUrl: './breakup-component.component.html',
    styleUrls: ['./breakup-component.css']
})


export class BreakUpComponent implements OnInit {
    public heading;
    public translations;
    public breakups;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<BreakUpComponent>,
        public financialRatioCalculatorViewModel: FinancialRatioCalculatorViewModel) {
        dialogRef.disableClose = true;
    }


    ngOnInit() {
        this.heading = this.data.heading;
        this.translations = this.data.header;
        this.breakups = this.data.breakUpobj;
        this.financialRatioCalculatorViewModel.didRemovePadding();
    }

    didClickCloseDialog(isCalculateAmount = false) {
        if (isCalculateAmount) {
        }
        this.dialogRef.close();
    }
}
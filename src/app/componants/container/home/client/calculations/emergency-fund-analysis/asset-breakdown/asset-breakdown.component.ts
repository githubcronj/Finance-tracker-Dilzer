import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmergencyFundViewModel } from '../emergency-fund-view-model';
import { AssetBreakupTranslations } from './asset-breakdown.translations'
import { Inject } from '@angular/core';

@Component({
    selector: 'app-asset-breakdown',
    templateUrl: './asset-breakdown.component.html',
    styleUrls: ['./asset-breakdown.component.css']
})


export class AssetBreakdownComponent implements OnInit {

    public translations = AssetBreakupTranslations;


    constructor(
        @Inject(MAT_DIALOG_DATA) public insurance: any,
        private dialogRef: MatDialogRef<AssetBreakdownComponent>,
        public emergencyFundViewModel: EmergencyFundViewModel) {
        dialogRef.disableClose = true;
    }


    ngOnInit() {
        this.emergencyFundViewModel.didRemovePadding();
        console.log('Insurance-> ',this.insurance);
    }


    didClickCloseDialog(isCalculateAmount = false) {
        if (isCalculateAmount) {
        }
        this.dialogRef.close();
    }
}
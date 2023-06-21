import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssetBreakupTranslations } from './asset-breakup.translations';
import { CurrencyFormatter } from '../../../../../../../core/currency-formatter';
import { GoalFundingViewModel } from '../../goal-funding/goal-funding-view-model';
import { MaterialDialogPaddingRemover } from '../../../../../../../core/material-dialog-padding-remover';


@Component({
    selector: 'app-asset-breakup',
    templateUrl: './asset-breakup.component.html',
    styleUrls: ['./asset-breakup.component.css']
})


export class AssetBreakupComponent implements OnInit {

    public translations = AssetBreakupTranslations;
    public currencyFormatter = new CurrencyFormatter();


    constructor(
        public dialogRef: MatDialogRef<AssetBreakupComponent>,
        @Inject(MAT_DIALOG_DATA) public breakupDetail: any,
        private goalFundingViewModel: GoalFundingViewModel
    ) {
        dialogRef.disableClose = true;
    }


    ngOnInit() {
        const removePadding = new MaterialDialogPaddingRemover();
        return removePadding.didRemovePaddingForMaterialDialog();
    }


    didClickCloseDialog(isCalculateAmount = false) {
        this.dialogRef.close();
    }

    displayCurrency(amount) {
        return this.currencyFormatter.currencyFormatter(amount);
    }

    formatDate(date) {
        return this.goalFundingViewModel.convertDateFormat(date);
    }

}

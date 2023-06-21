import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GoalFundingViewModel } from '../goal-funding-view-model';
import { GoalCorpusBreakupTranslations } from './goal-corpus-breakup.translations'


@Component({
    selector: 'app-goal-corpus-breakup',
    templateUrl: './goal-corpus-breakup.component.html',
    styleUrls: ['./goal-corpus-breakup.component.css']
})


export class GoalCorpusBreakupComponent implements OnInit {

    public translations = GoalCorpusBreakupTranslations;


    constructor(
        public dialogRef: MatDialogRef<GoalCorpusBreakupComponent>,
        public goalFundingViewModel: GoalFundingViewModel,
        @Inject(MAT_DIALOG_DATA) public breakupDetail: any
    ) {
        dialogRef.disableClose = true;
    }


    ngOnInit() {
        this.goalFundingViewModel.didRemovePadding();
    }


    didClickCloseDialog(isCalculateAmount = false) {
        this.dialogRef.close();
    }
}

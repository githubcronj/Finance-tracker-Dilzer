import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Stages, StagesUtils } from '../../../model/enum/stages.enum'


@Component({
    selector: 'app-activity-log',
    templateUrl: './activity-log.component.html',
    styleUrls: ['./activity-log.component.css']
})


export class ActivityLogComponent implements OnInit {

    public stageUtils = StagesUtils;


    constructor(
        public dialogRef: MatDialogRef<ActivityLogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit() {
        const contanierHolder = <HTMLElement>document.querySelector('.mat-dialog-container');
        contanierHolder.style.cssText = 'padding: 0px !important';
    }
}

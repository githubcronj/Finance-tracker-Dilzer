import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, OnDestroy, AfterContentChecked } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { Asset } from '../../../../../../model/asset/asset';
import { Liability } from '../../../../../../model/liability/liability';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpService } from '../../../../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../../../../model/parsers/json-convert';
import { Goal } from '../../../../../../model/goal/goal';
import { FormatterService } from 'app/services/formatter.service';
import { GoalType, GoalTypeUtils } from '../../../../../../model/enum/goal-type.enum';
import { ResourcesService } from '../../../../../../services/resources.service';
import { MessageService } from '../../../../../../services/message.service';
import { GoalFundingViewModel } from './goal-funding-view-model';
import { AssetsViewModel } from './assets-view-model';
import { AssetBreakupComponent } from './asset-breakup/asset-breakup.component';
import { GoalCorpusBreakupComponent } from './goal-corpus-breakup/goal-corpus-breakup.component';

@Component({
    selector: 'app-goal-funding',
    templateUrl: './goal-funding.component.html',
    styleUrls: ['./goal-funding.component.css']
})

export class GoalFundingComponent implements OnInit, OnDestroy, AfterContentChecked {

    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    msgs = [];
    isErrorOccured = false;

    constructor(
        public resources: ResourcesService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
        public goalFundingViewModel: GoalFundingViewModel,
        private matDialog: MatDialog
    ) { }

    ngOnInit() {
        this.changeDetector.detectChanges();
        this.goalFundingViewModel.clientId = this.clientId;
        this.getGoalFundingInfos();
    }

    async getGoalFundingInfos() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.goalFundingViewModel.getGoalFundingInfos();
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true;
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }

    dragStart(event, asset, isMappedToGoal) {
        if (isMappedToGoal) {
            event.preventDefault();
        }
        this.goalFundingViewModel.draggedAssetViewModel = asset;
    }

    async drop(event, goal) {
        this.goalFundingViewModel.droppedToGoalViewModel = await goal;
        const canMapGoalDateCheck = await this.goalFundingViewModel.canMapAssetToGoalDateCheck();
        const canMapAssetToGoalPercentCheck = await this.goalFundingViewModel.canMapAssetToGoalPercentCheck();

        if (canMapGoalDateCheck && canMapAssetToGoalPercentCheck) {
            try {
                this.messageService.sendMessage('show-loading-with-transparent');
                await this.goalFundingViewModel.mapAssetToGoal();
                this.messageService.sendMessage('hide-loading');
            } catch (error) {
                this.messageService.sendMessage('hide-loading');
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        } else {
            if (!canMapGoalDateCheck) {
                const alertMessage = this.goalFundingViewModel.draggedAssetViewModel.name + ' is not available at the start of ' + this.goalFundingViewModel.droppedToGoalViewModel.name;
                alert(alertMessage);
            } else if (!canMapAssetToGoalPercentCheck) {
                const alertMessage = 'Funding is completed for this ' + this.goalFundingViewModel.droppedToGoalViewModel.name;
                alert(alertMessage);
            }
        }
    }

    async saveMap() {
        try {
            this.messageService.sendMessage('show-loading-with-transparent');
            const response = await this.goalFundingViewModel.saveGoalMap();
            this.messageService.sendMessage('hide-loading');
            if (response.message) {
                this.msgs = [{ severity: 'success', summary: 'Success', detail: response.message }];
            }
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }

    async deleteAssetMapped(goalDetail, mappedAsset) {
        if (confirm('Are you sure you want to delete this allocated asset?') == true) {
            try {
                this.messageService.sendMessage('show-loading-with-transparent');
                await this.goalFundingViewModel.deleteMappedAsset(goalDetail, mappedAsset);
                this.messageService.sendMessage('hide-loading');
            } catch (error) {
                this.messageService.sendMessage('hide-loading');
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }

    async showCorpusRequiredBreakUp(goalVM) {
        if (goalVM.goalCorpusBreakup && goalVM.goalCorpusBreakup.length > 0) {
            const dialogRef = this.matDialog.open(GoalCorpusBreakupComponent, {
                data: { 'breakup': goalVM }
            });
        }
    }

    async showAssetBreakUp(breakup) {
        const dialogRef = this.matDialog.open(AssetBreakupComponent, {
            data: { 'breakup': breakup }
        });
    }

    ngAfterContentChecked() {
        this.changeDetector.detectChanges()
    }

    async cancelAll() {
        await this.getGoalFundingInfos();
    }

    ngOnDestroy() {
        this.changeDetector.detach();
    }

}

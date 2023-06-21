import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component';
import { RiskProfileSettingViewModel } from './risk-profile-setting-view-model';
import { MessageService } from '../../../../services/message.service';

@Component({
    selector: 'app-riskProfileSetting',
    templateUrl: './riskProfileSetting.component.html',
    styleUrls: ['./riskProfileSetting.component.css']
})

export class RiskProfileSettingComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    riskProfileSettingList;
    msgs = [];
    isErrorOccured = false;

    constructor(public riskProfileSettingViewModel: RiskProfileSettingViewModel, private messageService: MessageService,
        private changeDetector: ChangeDetectorRef) {

    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {

        try {
            this.messageService.sendMessage('show-loading');
            await this.riskProfileSettingViewModel.getSettings();
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"
        }

    }
    async saveSettings() {
        try {
            const response = await this.riskProfileSettingViewModel.saveRiskProfileSettings();
            this.msgs = []
            this.msgs = [{ severity: 'success', summary: 'Success', detail: response.message }];
        }
        catch (error) {

            this.msgs = []
            this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        }
    }

    retry() {
        this.loadData();
    }
}

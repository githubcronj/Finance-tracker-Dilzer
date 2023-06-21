import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipTranslations } from '../../../../../../translations/tooltip.translations';
import { KeychainService } from '../../../../../../services/keychain.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { MessageService } from '../../../../../../services/message.service';
import { DatePickerComponent } from '../../../../date-picker/date-picker.component';
import { ScenarioAnalysisViewModel } from './scenario-analysis-view-model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-scenario-analysis',
    templateUrl: './scenario-analysis.component.html',
    styleUrls: ['./scenario-analysis.component.css']
})

export class ScenarioAnalysisComponent implements OnInit {

    msgs = [];
    isErrorOccured = false;
    loadingOnSubmit = false;
    tooltipTranslations = TooltipTranslations;
    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @ViewChild('startDatePicker') startDatePicker: DatePickerComponent;
    @ViewChild('endDatePicker') endDatePicker: DatePickerComponent;

    goalDetailForm = new FormGroup({
        goalsListControl: new FormControl(null, [Validators.required]),
        currentValuationControl: new FormControl(null, [Validators.required]),
        inflationRateControl: new FormControl(null, [Validators.required]),
        categoryControl: new FormControl(null),
        goalFrequencyControl: new FormControl(null),
    });

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private keyChainService: KeychainService,
        public resources: ResourcesService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
        public scenarioAnalysisViewModel: ScenarioAnalysisViewModel
    ) {

    }

    async ngOnInit() {
        if (this.activatedRoute.snapshot.params['clientId']) {
            this.clientId = this.activatedRoute.snapshot.params['clientId'];
        }
        this.scenarioAnalysisViewModel.clientId = this.clientId;
        this.getGoalInfos();
    }

    async getGoalInfos() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.scenarioAnalysisViewModel.getAllGoalInfos();
            this.configureDates();
            if (this.scenarioAnalysisViewModel.goals.length == 0) {
                throw (new Error());
            }
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true;
            this.changeDetector.detectChanges();
            if (error.message) {
                this.errorHandling.message = error.message;
            } else {
                this.errorHandling.message = 'The goals added are not funded. Start funding goals to analyze different scenarios.';
                this.errorHandling.buttonText = 'Go to goal funding';
            }
            this.messageService.sendMessage('hide-loading');
        }
    }

    configureDates() {
        this.changeDetector.detectChanges();
        if (this.startDatePicker) {
            this.startDatePicker.client = this.scenarioAnalysisViewModel.clientDetail;
            this.startDatePicker.minDate = new Date()
            this.startDatePicker.configure(this.scenarioAnalysisViewModel.goalTimeLine.startDate);
        }
        if (this.endDatePicker) {
            this.endDatePicker.client = this.scenarioAnalysisViewModel.clientDetail;
            this.endDatePicker.minDate = this.startDatePicker.eventDate.date;
            this.endDatePicker.configure(this.scenarioAnalysisViewModel.goalTimeLine.endDate);
        }
    }

    async didGoalChanged(goal) {
        if (this.scenarioAnalysisViewModel.showEndDate && this.endDatePicker) {
            this.endDatePicker.datePickerFormGroup.controls['dateControl'].markAsUntouched();
        }
        this.startDatePicker.datePickerFormGroup.controls['dateControl'].markAsUntouched();
        await this.scenarioAnalysisViewModel.populateSeletedGoalDetails();
        this.configureDates();
    }

    changeCategory() {
        if (this.scenarioAnalysisViewModel.isGoalHAppenMoreThanYear == true) {
            this.scenarioAnalysisViewModel.showEndDate = true
            this.changeDetector.detectChanges();
            if (this.startDatePicker.eventDate.date) {
                this.endDatePicker.minDate = this.startDatePicker.eventDate.date
            }
            this.scenarioAnalysisViewModel.goalTimeLine.frequency = this.scenarioAnalysisViewModel.goalFrequency[0].key
            this.configureDates();
        } else {
            this.scenarioAnalysisViewModel.showEndDate = false
        }
    }

    changeDate() {

        if (this.startDatePicker.eventDate.date) {

            if (this.endDatePicker) {
                this.endDatePicker.minDate = this.startDatePicker.eventDate.date
            }
        }

        if (this.endDatePicker && this.endDatePicker.eventDate.date && this.startDatePicker.eventDate.date && this.endDatePicker.eventDate.date > this.startDatePicker.eventDate.date) {
            this.endDatePicker.eventDate.date = this.startDatePicker.eventDate.date
        }

        if (this.endDatePicker && this.endDatePicker.eventDate.date && this.endDatePicker.eventDate.date < this.startDatePicker.eventDate.date) {
            this.endDatePicker.eventDate.date = this.startDatePicker.eventDate.date
        }
    }

    async analyseGoalScenario() {
        let validStatus = true;
        if (!this.scenarioAnalysisViewModel.selectedGoalId) {
            validStatus = false;
            this.goalDetailForm.controls['goalsListControl'].setErrors({ 'required': true });
            this.goalDetailForm.controls['goalsListControl'].markAsTouched();
        }
        if (!this.scenarioAnalysisViewModel.inflationRate) {
            validStatus = false;
            this.goalDetailForm.controls['inflationRateControl'].setErrors({ 'required': true });
            this.goalDetailForm.controls['inflationRateControl'].markAsTouched();
        }
        if (!this.scenarioAnalysisViewModel.currentValuation) {
            validStatus = false;
            this.goalDetailForm.controls['currentValuationControl'].setErrors({ 'required': true });
            this.goalDetailForm.controls['currentValuationControl'].markAsTouched();
        }

        if (this.scenarioAnalysisViewModel.showEndDate && this.endDatePicker) {
            if (this.endDatePicker.validate() == false) {
                validStatus = false;
                return
            } else {
                this.endDatePicker.datePickerFormGroup.controls['dateControl'].markAsUntouched();
            }
        }
        if (this.startDatePicker.validate() == false) {
            validStatus = false;
            return
        } else {
            this.startDatePicker.datePickerFormGroup.controls['dateControl'].markAsUntouched();
        }

        if (validStatus) {
            try {
                this.loadingOnSubmit = true;
                this.scenarioAnalysisViewModel.goalTimeLine.startDate = this.startDatePicker.valueToSend();

                if (!this.scenarioAnalysisViewModel.showEndDate) {
                    this.scenarioAnalysisViewModel.goalTimeLine.endDate = undefined
                    this.scenarioAnalysisViewModel.goalTimeLine.frequency = undefined
                } else {
                    this.scenarioAnalysisViewModel.goalTimeLine.endDate = this.endDatePicker.valueToSend();
                    this.scenarioAnalysisViewModel.goalTimeLine.frequency = this.scenarioAnalysisViewModel.goalTimeLine.frequency

                    if (!this.startDatePicker.verifyEndDate(this.startDatePicker.eventDate, this.endDatePicker.eventDate)) {

                        this.loadingOnSubmit = false;
                        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'End Date must be greater than Start Date.' }];
                    }
                }
                await this.scenarioAnalysisViewModel.analyseGoalFunding();
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again.' }];
                }
            }
        }
    }

    async didErrorHandlingButtonClicked() {
        if (this.errorHandling.buttonText == 'Retry' || this.errorHandling.buttonText == 'retry') {
            this.getGoalInfos();
        } else {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 4, selectedSubIndex: 1 } });
        }
    }
}

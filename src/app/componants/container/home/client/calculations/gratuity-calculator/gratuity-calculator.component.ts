import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { GratuityCalculatorViewModel } from './gratuity-calculator-view-model';
import { MessageService } from '../../../../../../services/message.service';


@Component({
    selector: 'app-gratuity-calculator',
    templateUrl: './gratuity-calculator.component.html',
    styleUrls: ['./gratuity-calculator.component.css']
})


export class GratuityCalculatorComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Input('clientId') clientId: string;

    msgs = [];
    isErrorOccured = false;
    loadingOnSubmit = false;
    loadClientTaxation = false;
    loadSpouseTaxation = false;

    gratuityCalculatorForm = new FormGroup({
        planDateControl: new FormControl(null),
        dateOfBirthControl: new FormControl(null),
        ageAsOnDateControl: new FormControl(null),
        nameControl: new FormControl(null),
        endOfServiceAgeControl: new FormControl(null),
        endOfServiceDateControl: new FormControl(null),
        dateOfJoiningControl: new FormControl(null),
        timeToRetireControl: new FormControl(null),
        experienceInCurrentOrganizationControl: new FormControl(null),
        typeOfEmployerControl: new FormControl(null),
        currentSalaryControl: new FormControl(null),
        avgExpectedHikeControl: new FormControl(null),
        endOfServiceSalaryControl: new FormControl(null),
        timeAtEndOfServiceSalaryControl: new FormControl(null),
        presentValueOfGratuityControl: new FormControl(null),
        futureValueOfGratuityControl: new FormControl(null),
        maxLimitExemptionControl: new FormControl(null),
        taxSlabControl: new FormControl(null),
        
        spousePlanDateControl: new FormControl(null),
        spouseDateOfBirthControl: new FormControl(null),
        spouseAgeAsOnDateControl: new FormControl(null),
        spouseNameControl: new FormControl(null),
        spouseEndOfServiceAgeControl: new FormControl(null),
        spouseEndOfServiceDateControl: new FormControl(null),
        spouseDateOfJoiningControl: new FormControl(null),
        spouseTimeToRetireControl: new FormControl(null),
        spouseExperienceInCurrentOrganizationControl: new FormControl(null),
        spouseTypeOfEmployerControl: new FormControl(null),
        spouseCurrentSalaryControl: new FormControl(null),
        spouseAvgExpectedHikeControl: new FormControl(null),
        spouseEndOfServiceSalaryControl: new FormControl(null),
        spouseTimeAtEndOfServiceSalaryControl: new FormControl(null),
        spousePresentValueOfGratuityControl: new FormControl(null),
        spouseFutureValueOfGratuityControl: new FormControl(null),
        spouseMaxLimitExemptionControl: new FormControl(null),
        spouseTaxSlabControl: new FormControl(null),
    });


    constructor(
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        public gratuityCalculatorViewModel: GratuityCalculatorViewModel,
        private messageService: MessageService
    ) { }


    ngOnInit() {
        this.gratuityCalculatorViewModel.clientId = this.clientId;
        this.getGratuityDetails();
    }


    async getGratuityDetails() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.gratuityCalculatorViewModel.getUserDetails();
            this.gratuityCalculatorViewModel.getOwnerList();
            await this.gratuityCalculatorViewModel.getGratuity();
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true;
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
        }
    }

    async calculateGratuityAndTaxation() {
        let validationSucceded = true;
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.maxLimitExemption == null) {
            this.gratuityCalculatorForm.controls['maxLimitExemptionControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['maxLimitExemptionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.taxSlab == null) {
            this.gratuityCalculatorForm.controls['taxSlabControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['taxSlabControl'].markAsTouched();
            validationSucceded = false;
        }
        if (validationSucceded) {
            this.loadingOnSubmit = true;
            try {
                this.gratuityCalculatorViewModel.calculatePayableGratuity();
                this.calculateGratuity();
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                this.msgs = []
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }

            }
        }
    }

    async calculateSpouseGratuityAndTaxation() {
        let validationSucceded = true;
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseMaxLimitExemption == null) {
            this.gratuityCalculatorForm.controls['spouseMaxLimitExemptionControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseMaxLimitExemptionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseTaxSlab == null) {
            this.gratuityCalculatorForm.controls['spouseTaxSlabControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseTaxSlabControl'].markAsTouched();
            validationSucceded = false;
        }
        if (validationSucceded) {
            this.loadingOnSubmit = true;
            try {
                this.gratuityCalculatorViewModel.calculateSpousePayableGratuity();
                this.calculateSpouseGratuity();
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                this.msgs = []
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }

            }
        }
    }

    async calculateSpouseGratuity() {
        let validationSucceded = true;
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseGrowthRate == null) {
            this.gratuityCalculatorForm.controls['sposueAvgExpectedHikeControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['sposueAvgExpectedHikeControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseSalaryComponant == null) {
            this.gratuityCalculatorForm.controls['spouseCurrentSalaryControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseCurrentSalaryControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseCompanyType == null) {
            this.gratuityCalculatorForm.controls['spouseTypeOfEmployerControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseTypeOfEmployerControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseRetirementAge == null) {
            this.gratuityCalculatorForm.controls['spouseEndOfServiceAgeControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseEndOfServiceAgeControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseDateOfJoinng == null) {
            this.gratuityCalculatorForm.controls['spouseDateOfJoiningControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseDateOfJoiningControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseValuationDate == null) {
            this.gratuityCalculatorForm.controls['spousePlanDateControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spousePlanDateControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spouseOwnerName == null) {
            this.gratuityCalculatorForm.controls['spouseNameControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseNameControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.spousedob == null) {
            this.gratuityCalculatorForm.controls['spouseDateOfBirthControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['spouseDateOfBirthControl'].markAsTouched();
            validationSucceded = false;
        }

        if (validationSucceded) {
            this.loadingOnSubmit = true;
            try {
                this.loadSpouseTaxation = true;
                await this.gratuityCalculatorViewModel.calculateSpouseGratuity();
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                this.msgs = []
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }

            }
        }
    }

    async calculateGratuity() {
        let validationSucceded = true;
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.growthRate == null) {
            this.gratuityCalculatorForm.controls['avgExpectedHikeControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['avgExpectedHikeControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.salaryComponant == null) {
            this.gratuityCalculatorForm.controls['currentSalaryControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['currentSalaryControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.companyType == null) {
            this.gratuityCalculatorForm.controls['typeOfEmployerControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['typeOfEmployerControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.retirementAge == null) {
            this.gratuityCalculatorForm.controls['endOfServiceAgeControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['endOfServiceAgeControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.dateOfJoinng == null) {
            this.gratuityCalculatorForm.controls['dateOfJoiningControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['dateOfJoiningControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.valuationDate == null) {
            this.gratuityCalculatorForm.controls['planDateControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['planDateControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.ownerName == null) {
            this.gratuityCalculatorForm.controls['nameControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['nameControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.gratuityCalculatorViewModel && this.gratuityCalculatorViewModel.gratuity.dob == null) {
            this.gratuityCalculatorForm.controls['dateOfBirthControl'].setErrors({ 'required': true });
            this.gratuityCalculatorForm.controls['dateOfBirthControl'].markAsTouched();
            validationSucceded = false;
        }

        if (validationSucceded) {
            this.loadingOnSubmit = true;
            try {
                this.loadClientTaxation = true;
                await this.gratuityCalculatorViewModel.calculateGratuity();
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                this.msgs = []
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }

            }
        }
    }

    retry() {
        this.getGratuityDetails()
    }

}

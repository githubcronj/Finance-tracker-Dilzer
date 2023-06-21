import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpService } from '../../../services/http.service';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { Asset } from '../../../model/asset/asset';
import { Client } from '../../../model/client';
import { RequestMethod } from '@angular/http';
import { Location } from '@angular/common';
import { Insurance } from '../../../model/asset/insurance';
import { InsuranceTranslations } from './insurance.translations';
import { InsuranceAssetSubType } from '../../../model/enum/asset/insurance-sub-type.enum'
import { InsuranceFrequencyType, InsuranceFrequencyTypeUtils } from '../../../model/enum/asset//insurance-frequency-type.enum'
import * as DateDiff from 'date-diff';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { ResourcesService } from '../../../services/resources.service';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';



@Component({
    selector: 'app-insurance',
    templateUrl: './insurance.component.html',
    styleUrls: ['./insurance.component.css'],

})

export class InsuranceComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    insuranceTranslations = InsuranceTranslations;
    loadingOnSubmit = false;
    asset: any = {};
    assetId;
    clientId;
    msgs = []
    isErrorOccured = false
    tooltipTranslations = TooltipTranslations;
    addUpdateInsuranceButtonText = 'Add';
    insuranceFrequencyTypes = InsuranceFrequencyTypeUtils.getAllInsuranceFrequencyType();


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        private changeDetector: ChangeDetectorRef,
        public resources: ResourcesService,
        private messageService: MessageService

    ) { }

    insuranceForm = new FormGroup({
        sumAssuredControl: new FormControl(null, [Validators.required]),
        deathBenefitControl: new FormControl(null, [Validators.required]),
        premiumControl: new FormControl(null, [Validators.required]),
        premiumStartDateControl: new FormControl(null),
        premiumEndDateControl: new FormControl(null),
        numberOfPremiumPaidControl: new FormControl(null),
        numberOfPremiumPayableControl: new FormControl(null),
        bonusControl: new FormControl(null, [Validators.required]),
        maturityDateControl: new FormControl(null, [Validators.required]),
        frequencyPeriodControl: new FormControl(null)
    });

    async ngOnInit() {
        this.loadData()

    }

    async loadData() {

        try {
            this.clientId = this.route.snapshot.params['clientId'];
            this.assetId = this.route.snapshot.params['assetId'];
            this.navbar.routeBackTitle = this.insuranceTranslations.backButtonTitle;
            this.navbar.isBorderEnabled = true;
            this.navbar.title = this.insuranceTranslations.heading;
            this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;

            this.messageService.sendMessage('show-loading');
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            let userDetails = parser.deserialize(response.client, Client);
            this.navbar.subTitle = userDetails.name.fullName()
            await this.getAssetDetails();

            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }

    }

    retry() {
        this.loadData()
    }

    async getAssetDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
            const parser = new JsonConvert()
            this.asset = parser.deserialize(response.asset, Insurance);
            if (this.asset.premiumFrequency == null) {
                this.asset.premiumFrequency = InsuranceFrequencyType.Yearly
            }
        } catch (error) {
            throw error
        }
    }

    async createInsurance() {

        let validationSucceded = true;

        if (this.asset && !this.asset.sumAssured) {
            this.insuranceForm.controls['sumAssuredControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['sumAssuredControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.asset && !this.asset.deathBenefit) {
            this.insuranceForm.controls['deathBenefitControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['deathBenefitControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.asset && !this.asset.premium) {
            this.insuranceForm.controls['premiumControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['premiumControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.asset && !this.asset.premiumStartDate) {
            this.insuranceForm.controls['premiumStartDateControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['premiumStartDateControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.asset && !this.asset.premiumEndDate) {
            this.insuranceForm.controls['premiumEndDateControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['premiumEndDateControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.asset && !this.asset.maturityDate) {
            this.insuranceForm.controls['maturityDateControl'].setErrors({ 'required': true });
            this.insuranceForm.controls['maturityDateControl'].markAsTouched();
            validationSucceded = false;
        }

        if (validationSucceded) {

            try {
                const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/asset/' + this.assetId, this.asset);
                this.routeBack()
                this.loadingOnSubmit = false;
            } catch (error) {
                this.loadingOnSubmit = false;
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }

            }
        }
    }


    didSelectInsuranceFrequency(event) {
        this.autoCalculate()
    }


    didClickStartDateTextBox(event) {
        this.autoCalculate()
    }

    didClickEndDateTextBox(event) {
        // if (this.asset.maturityDate) {
        //     if (this.asset.maturityDate < this.asset.premiumEndDate) {
        //         this.asset.maturityDate = this.asset.premiumEndDate
        //     }
        // }
        this.autoCalculate()
    }

    autoCalculate() {

        if (this.asset.premiumStartDate != null && this.asset.premiumFrequency != null) {
            var diff = new DateDiff(new Date(), this.asset.premiumStartDate);


            var diff;
            let years;

            if (this.asset.premiumEndDate < new Date()) {
                diff = new DateDiff(this.asset.premiumEndDate, this.asset.premiumStartDate);
                years = Math.round(diff.years());
                this.asset.numberOfPremiumPaid = years + 1;
            } else {
                diff = new DateDiff(new Date(), this.asset.premiumStartDate);
                years = Math.round(diff.years());

                let months = Math.round(diff.months())


                if (months > 0) {
                    if (this.asset.premiumFrequency == InsuranceFrequencyType.Yearly) {
                        this.asset.numberOfPremiumPaid = Math.ceil(months / 12)
                    } else if (this.asset.premiumFrequency == InsuranceFrequencyType.HalfYearly) {
                        this.asset.numberOfPremiumPaid = Math.ceil(months / 6)

                    } else if (this.asset.premiumFrequency == InsuranceFrequencyType.Quarterly) {
                        this.asset.numberOfPremiumPaid = Math.ceil(months / 3)
                    } else {
                        this.asset.numberOfPremiumPaid = Math.ceil(months / 1)
                    }
                } else {
                    this.asset.numberOfPremiumPaid = 1
                }
            }

        }

        if (this.asset.premiumEndDate != null && this.asset.premiumStartDate != null && this.asset.premiumFrequency != null) {
            var diff = new DateDiff(this.asset.premiumEndDate, this.asset.premiumStartDate);
            let years = Math.round(diff.years())

            if (years >= 1) {

                if (this.asset.premiumFrequency == InsuranceFrequencyType.Yearly) {
                    this.asset.numberOfPremiumPayable = Math.floor(years * 1) + 1
                } else if (this.asset.premiumFrequency == InsuranceFrequencyType.HalfYearly) {
                    this.asset.numberOfPremiumPayable = Math.floor(years * 2) + 1
                } else if (this.asset.premiumFrequency == InsuranceFrequencyType.Quarterly) {
                    this.asset.numberOfPremiumPayable = Math.floor(years * 4) + 1
                } else {
                    this.asset.numberOfPremiumPayable = Math.floor(years * 12) + 1

                    let months = Math.round(diff.months())


                    if (months > 0) {

                        if (this.asset.premiumFrequency == InsuranceFrequencyType.Yearly) {
                            this.asset.numberOfPremiumPayable = Math.ceil(months / 12) + 1
                        } else if (this.asset.premiumFrequency == InsuranceFrequencyType.HalfYearly) {
                            this.asset.numberOfPremiumPayable = Math.ceil(months / 6) + 1

                        } else if (this.asset.premiumFrequency == InsuranceFrequencyType.Quarterly) {
                            this.asset.numberOfPremiumPayable = Math.ceil(months / 3) + 1
                        } else {
                            this.asset.numberOfPremiumPayable = Math.ceil(months / 1) + 1
                        }
                    } else {
                        this.asset.numberOfPremiumPayable = 1
                    }

                }
            }
        }
    }


    routeBack() {
        this.navbar.routeBack()
    }

}

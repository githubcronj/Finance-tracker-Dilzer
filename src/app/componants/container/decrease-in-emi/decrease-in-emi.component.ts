import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { FinanceService } from '../../../services/finance.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { DecreaseInEmi } from '../../../model/liability/decreaseInEmi/decreaseInEmi'
import { Liability } from '../../../model/liability/liability'
import { DecreaseInEmiTranslations } from './decrease-in-emi.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { noUndefined } from '@angular/compiler/src/util';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';



@Component({
    selector: 'app-decrease-in-emi',
    templateUrl: './decrease-in-emi.component.html',
    styleUrls: ['./decrease-in-emi.component.css']
})


export class DecreaseInEmiComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    addUpdateDecreaseInEmiButtonText = 'Add';
    loadingOnSubmit = false;
    clientId;
    msgs = [];
    liabilityId;
    liability: Liability = new Liability();
    decreaseInEmiTranslations = DecreaseInEmiTranslations;
    isErrorOccured = false
    userDetails: any = {}

    decreaseInEmiForm = new FormGroup({
        percentageDecreaseControl: new FormControl(null, [Validators.required]),
        decreasedEMIControl: new FormControl(null, [Validators.required]),
        rateOfInterestControl: new FormControl(null, [Validators.required]),
        repaymentsPayableAfterRevisionControl: new FormControl(null, [Validators.required]),
        interestPayableAfterRevisionControl: new FormControl(null, [Validators.required]),
        additionalInterestPayableControl: new FormControl(null, [Validators.required])
    });

    constructor(private httpService: HttpService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private financeService: FinanceService,
        private changeDetector: ChangeDetectorRef,
        public resources: ResourcesService,
        private messageService: MessageService
    ) { }


    async ngOnInit() {
        this.loadData()
    }


    async loadData() {

        try {

            this.clientId = this.route.snapshot.params['clientId'];
            this.liabilityId = this.route.snapshot.params['liabilityId'];


            this.navbar.routeBackTitle = 'Liability Information';
            this.navbar.isBorderEnabled = true;
            this.navbar.routeBackPath = `/auth/client/${this.clientId}/liability/${this.liabilityId}`;
            this.navbar.title = 'Decrease In EMI';

            this.messageService.sendMessage('show-loading');
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.userDetails = parser.deserialize(response.client, Client);
            await this.getLiability()

            if (this.liabilityId) {
                await this.getDecreaseInEmiDetails();
            }

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

    async getLiability() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
            const parser = new JsonConvert()
            this.liability = parser.deserialize(response.liability, Liability);
            this.navbar.subTitle = this.liability.name + ' of ' + this.userDetails.name.fullName();

        } catch (error) {
            throw error
        }
    }


    async getDecreaseInEmiDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
            const parser = new JsonConvert()
            this.liability = parser.deserialize(response.liability, Liability);
            this.navbar.routeBackTitle = this.liability.name;
            if (this.liability.decreaseInEmi == undefined) {
                this.liability.decreaseInEmi = new DecreaseInEmi()
            }

            if (this.liability.decreaseInEmi.revisedRate == null) {

                this.liability.decreaseInEmi.revisedRate = this.liability.rateOfInterest

            }

        } catch (error) {
            throw error
        }

    }


    async didClickDecreaseInEmi() {
        let validationSucceded = true;

        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.decreasePercentage == null) {
            this.decreaseInEmiForm.controls['percentageDecreaseControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['percentageDecreaseControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.emiPaidAfterRevision == null) {
            this.decreaseInEmiForm.controls['decreasedEMIControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['decreasedEMIControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.revisedRate == null) {
            this.decreaseInEmiForm.controls['rateOfInterestControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['rateOfInterestControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.numberOfRepaymentsPayableAfterRevision == null) {
            this.decreaseInEmiForm.controls['repaymentsPayableAfterRevisionControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['repaymentsPayableAfterRevisionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.remainingInterestPayableAfterRevision == null) {
            this.decreaseInEmiForm.controls['interestPayableAfterRevisionControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['interestPayableAfterRevisionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.decreaseInEmi && this.liability.decreaseInEmi.additionalInterestPayableAfterRevision == null) {
            this.decreaseInEmiForm.controls['additionalInterestPayableControl'].setErrors({ 'required': true });
            this.decreaseInEmiForm.controls['additionalInterestPayableControl'].markAsTouched();
            validationSucceded = false;
        }


        if (validationSucceded) {

            try {
                const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/decrease-emi', this.liability.decreaseInEmi);
                this.didClickCancelButton()
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

    didChangePercentage() {

        this.liability.decreaseInEmi.emiPaidAfterRevision = Math.round(this.liability.currentStage.emiPaid * (1 - (this.liability.decreaseInEmi.decreasePercentage / 100) / 12))
        this.autoCalculate()
    }


    didChangeEmiAmount() {

        let diffInEmiAmount = (((this.liability.currentStage.emiPaid - this.liability.decreaseInEmi.emiPaidAfterRevision) / this.liability.currentStage.emiPaid) * 100) * 12
        this.liability.decreaseInEmi.decreasePercentage = Math.round(diffInEmiAmount)

        this.autoCalculate()

    }

    didChangeRate() {
        this.autoCalculate()
    }

    autoCalculate() {

        this.liability.calculateDecreaseInEmi(this.financeService)
    }

    didClickCancelButton() {
        this.navbar.routeBack()
    }

}


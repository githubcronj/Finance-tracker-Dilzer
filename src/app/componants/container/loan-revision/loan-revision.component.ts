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
import { LoanRevision } from '../../../model/liability/loanRevision/loanRevision'
import { Liability } from '../../../model/liability/liability'
import { LoanRevisionTranslations } from './loan-revision.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { noUndefined } from '@angular/compiler/src/util';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';




@Component({
    selector: 'app-loan-revision',
    templateUrl: './loan-revision.component.html',
    styleUrls: ['./loan-revision.component.css']
})


export class LoanRevisionComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    addUpdateLoanRevisionButtonText = 'Add';
    loadingOnSubmit = false;
    clientId;
    msgs = [];
    liabilityId;
    liability: Liability = new Liability();
    loanRevisionTranslation = LoanRevisionTranslations;
    isErrorOccured = false
    userDetails: any = {}

    loanRevisionForm = new FormGroup({
        increasedEMIControl: new FormControl(null, [Validators.required]),
        percentageIncreaseControl: new FormControl(null, [Validators.required]),
        rateOfInterestControl: new FormControl(null, [Validators.required]),
        repaymentsPayableAfterRevisionControl: new FormControl(null, [Validators.required]),
        interestPayableAfterRevisionControl: new FormControl(null, [Validators.required]),
        savingsAfterRevisionControl: new FormControl(null, [Validators.required])
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
            this.changeDetector.detectChanges();
            this.clientId = this.route.snapshot.params['clientId'];
            this.liabilityId = this.route.snapshot.params['liabilityId'];

            this.navbar.routeBackTitle = 'Liability Information';
            this.navbar.isBorderEnabled = true;
            this.navbar.routeBackPath = `/auth/client/${this.clientId}/liability/${this.liabilityId}`;
            this.navbar.title = 'Loan Revision';

            this.messageService.sendMessage('show-loading');
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.userDetails = parser.deserialize(response.client, Client);
            await this.getLiability()

            if (this.liabilityId) {
                await this.getLoanRevisionDetails();
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

    async getLoanRevisionDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
            const parser = new JsonConvert()
            this.liability = parser.deserialize(response.liability, Liability);
            this.navbar.routeBackTitle = this.liability.name;
            if (this.liability.loanRevision == undefined) {
                this.liability.loanRevision = new LoanRevision()
            }

            if (this.liability.loanRevision.revisedRate == null) {

                this.liability.loanRevision.revisedRate = this.liability.rateOfInterest

            }

        } catch (error) {
            throw error
        }

    }


    async didAddLoanRevision() {
        let validationSucceded = true;

        if (this.liability.loanRevision && this.liability.loanRevision.increasePercentage == null) {
            this.loanRevisionForm.controls['percentageIncreaseControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['percentageIncreaseControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.loanRevision && this.liability.loanRevision.emiPaidAfterRevision == null) {
            this.loanRevisionForm.controls['increasedEMIControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['increasedEMIControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.loanRevision && this.liability.loanRevision.revisedRate == null) {
            this.loanRevisionForm.controls['rateOfInterestControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['rateOfInterestControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.loanRevision && this.liability.loanRevision.numberOfRepaymentsPayableAfterRevision == null) {
            this.loanRevisionForm.controls['repaymentsPayableAfterRevisionControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['repaymentsPayableAfterRevisionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.loanRevision && this.liability.loanRevision.remainingInterestPayableAfterRevision == null) {
            this.loanRevisionForm.controls['interestPayableAfterRevisionControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['interestPayableAfterRevisionControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.liability.loanRevision && this.liability.loanRevision.savingsAfterRevision == null) {
            this.loanRevisionForm.controls['savingsAfterRevisionControl'].setErrors({ 'required': true });
            this.loanRevisionForm.controls['savingsAfterRevisionControl'].markAsTouched();
            validationSucceded = false;
        }


        if (validationSucceded) {

            try {
                const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/loan-revision', this.liability.loanRevision);
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

        this.liability.loanRevision.emiPaidAfterRevision = Math.round(this.liability.currentStage.emiPaid * (1 + (this.liability.loanRevision.increasePercentage / 100) / 12))
        this.autoCalculate()
    }


    didChangeEmiAmount() {

        let diffInEmiAmount = (((this.liability.loanRevision.emiPaidAfterRevision - this.liability.currentStage.emiPaid) / this.liability.currentStage.emiPaid) * 100) * 12
        this.liability.loanRevision.increasePercentage = Math.round(diffInEmiAmount)

        this.autoCalculate()

    }

    didChangeRate() {
        this.autoCalculate()
    }

    autoCalculate() {

        this.liability.calculateIncreaseInEmi(this.financeService)
    }

    
    didClickCancelButton() {
        this.navbar.routeBack()
    }
}


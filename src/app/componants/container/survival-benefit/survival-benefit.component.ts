import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Asset } from '../../../model/asset/asset'
import { Insurance } from '../../../model/asset/insurance'
import { SurvivalBenefit } from '../../../model/asset/survivalBenefit'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { survivalBenefitTranslations } from './survival-benefit.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { ResourcesService } from '../../../services/resources.service';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'app-survival-benefit',
    templateUrl: './survival-benefit.component.html',
    styleUrls: ['./survival-benefit.component.css']
})

export class SurvivalBenefitComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    addUpdateSurvivalBenefitButtonText = 'Add';
    loadingOnSubmit = false;
    clientId;
    assetId;
    survivalBenefit: any = {}
    msgs = [];
    asset: any = {};
    translations = survivalBenefitTranslations
    survivalBenefitId;
    minDate;
    isErrorOccured = false
    tooltipTranslations = TooltipTranslations;
    
    survivalBenefitForm = new FormGroup({
        amountControl: new FormControl(null, [Validators.required]),
        startDateControl: new FormControl(null, [Validators.required]),
        endDateControl: new FormControl(null, [Validators.required]),
    });

    constructor(private httpService: HttpService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
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
            this.assetId = this.route.snapshot.params['assetId'];
            this.survivalBenefitId = this.route.snapshot.params['survivalBenefitId'];
            this.navbar.routeBackTitle = this.translations.backButtonTitle;
            this.navbar.isBorderEnabled = true;
            this.navbar.title = this.translations.heading;
            this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;      
            
            this.messageService.sendMessage('show-loading');
            if (this.assetId) {
                await this.getAsset()
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
    async getAsset() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
            const parser = new JsonConvert()
            let asset: Insurance = parser.deserialize(response.asset, Asset);
            this.minDate = asset.premiumStartDate

            if (this.survivalBenefitId) {
                this.addUpdateSurvivalBenefitButtonText = 'Update';
                this.survivalBenefit = asset.survivalBenefits.find(survivalBenefit => survivalBenefit._id == this.survivalBenefitId)
            }

        } catch (error) {
            throw error
        }
    }


    async didClickAddSurvivalBenefit() {
        let validationSucceded = true;


        if (this.survivalBenefit && !this.survivalBenefit.amount) {
            this.survivalBenefitForm.controls['amountControl'].setErrors({ 'required': true });
            this.survivalBenefitForm.controls['amountControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.survivalBenefit && !this.survivalBenefit.startDate) {
            this.survivalBenefitForm.controls['startDateControl'].setErrors({ 'required': true });
            this.survivalBenefitForm.controls['startDateControl'].markAsTouched();
            validationSucceded = false;
        }


        if (validationSucceded) {

            this.loadingOnSubmit = true;
            let url = '';
            let method;


            if (this.survivalBenefitId) {
                url = 'client/' + this.clientId + '/asset/' + this.assetId + '/survival-benefit/' + this.survivalBenefitId;
                method = RequestMethod.Put;
            } else {
                url = 'client/' + this.clientId + '/asset/' + this.assetId + '/survival-benefit';
                method = RequestMethod.Post;
            }


            try {
                const response = await this.httpService.request(method, url, this.survivalBenefit);
                this.loadingOnSubmit = false;
                this.didClickCancelButton();
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


    didClickCancelButton() {
        this.navbar.routeBack()
    }
}

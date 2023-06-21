import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod } from '@angular/http';
import { HttpService } from '../../../../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { KeychainService } from '../../../../../services/keychain.service';
import { JsonConvert } from '../../../../../model/parsers/json-convert';
import { Client } from '../../../../../model/client';
import { ErrorHandlingComponent } from '../../../../error-handling/error-handling.component'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RiskProfileComponent } from '../risk-profile/risk-profile.component'
import { MessageService } from '../../../../../services/message.service';

@Component({
    selector: 'app-risk-profile-questions',
    templateUrl: './risk-profile-questions.component.html',
    styleUrls: ['./risk-profile-questions.component.css']
})

export class RiskProfileQuestionsComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Input('clientId') clientId: string;

    msgs = [];
    isErrorOccured = false
    riskProfile
    userDetails: Client
    riskProfileQuestionnaries = []

    riskProfileForm = new FormGroup({
        answerControl: new FormControl(null),
    });

    constructor(
        private httpService: HttpService,
        private router: Router,
        private keychain: KeychainService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute
    ) { }


    async ngOnInit() {
        if (this.activatedRoute.snapshot.params['clientId']) {
            this.clientId = this.activatedRoute.snapshot.params['clientId'];
        }
        this.getRiskProfileInfos();
    }

    async getRiskProfileInfos() {

        try {
            this.messageService.sendMessage('show-loading');
            await this.getUserDetails();
            this.messageService.sendMessage('hide-loading');
        } catch (error) {

            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }



    async getUserDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.userDetails = parser.deserialize(response.client, Client);
            this.checkUserInfo()
            if (this.userDetails && this.userDetails.riskProfile && this.userDetails.riskProfile.name) {
                this.riskProfile = this.userDetails.riskProfile.name + " @ " + this.userDetails.riskProfile.rate
            }

        } catch (error) {
            throw error
        }
    }

    async getRiskProfileQuestionnaires() {

        try {
            const questionnairesResponse = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/risk-profile/questions', null);
            this.riskProfileQuestionnaries = questionnairesResponse.questions
        }
        catch (error) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"
        }
    }


    checkUserInfo() {

        if (this.userDetails.pan == undefined || this.userDetails.companyAddress.addressLine1 == undefined || this.userDetails.companyAddress.country == undefined || this.userDetails.companyAddress.city == undefined) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = "Personal Information is not filled"
            this.errorHandling.buttonText = "Click to fill Personal Information"
        }
    }

    async  openDialog() {
        try {
            await this.getRiskProfileQuestionnaires();
            if (this.riskProfileQuestionnaries.length > 0) {
                const dialogRef = this.dialog.open(RiskProfileComponent, {
                    disableClose: true,
                    width: '450px',
                    height: '410px',
                    data: {
                        'clientId': this.clientId,
                        'riskProfileQuestionarries': this.riskProfileQuestionnaries
                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.riskProfile = result.client.riskProfile.name + " @ " + this.userDetails.riskProfile.rate
                        this.getRiskProfileInfos();
                    }
                });
            }
        } catch (error) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"

        }

    }


    retry() {
        if (this.userDetails.pan == undefined) {
            this.router.navigate(['/auth/client/' + this.clientId + '/personal-info']);
        } else {
            this.getRiskProfileInfos()
        }
    }

}


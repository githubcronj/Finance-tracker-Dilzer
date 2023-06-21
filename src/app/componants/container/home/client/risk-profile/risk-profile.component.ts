import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod } from '@angular/http';
import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Router } from '@angular/router';
import { KeychainService } from '../../../../../services/keychain.service';
import { JsonConvert } from '../../../../../model/parsers/json-convert';
import { RiskProfileAnswer } from '../../../../../model/riskProfile/riskProfileAnswer';
import { AssetType, AssetTypeUtils } from '../../../../../model/enum/asset/asset-type.enum';
import { Client } from '../../../../../model/client';
import { ErrorHandlingComponent } from '../../../../error-handling/error-handling.component'
import { FormatterService } from 'app/services/formatter.service';
import * as $ from 'jquery';
import * as unescapeJs from 'unescape-js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Safe } from './../../../../../services/safe-html.pipe';
import { ResourcesService } from '../../../../../services/resources.service';
import { MessageService } from '../../../../../services/message.service';


@Component({
    selector: 'app-risk-profile',
    templateUrl: './risk-profile.component.html',
    styleUrls: ['./risk-profile.component.css']
})

export class RiskProfileComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    msgs = [];
    clientId
    isErrorOccured = false
    userDetails: Client
    riskProfileQuestionnaries = []
    index = 0;
    questionaries = {
        "answer_type": undefined,
        "category": undefined,
        "id": undefined,
        "options": undefined,
        "question": undefined
    }
    answers = []
    options;
    answerObject = new RiskProfileAnswer()
    auth_token;
    tableRadioOptions = {
        thead: [],
        tbody: []
    };
    loadingOnSubmit = false;
    errorMessage = false;

    riskProfileForm = new FormGroup({
        answerControl: new FormControl(null),
    });

    constructor(
        private httpService: HttpService,
        private router: Router,
        private keychain: KeychainService,
        private changeDetector: ChangeDetectorRef,
        public resources: ResourcesService,
        public dialogRef: MatDialogRef<RiskProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messageService: MessageService
    ) { }


    async ngOnInit() {
        this.clientId = this.data.clientId
        await this.loadData()

    }

    async loadData() {
        try {

            this.messageService.sendMessage('show-loading');
            await this.getRiskProfileQuestionnaires()
            await this.setQuestionnaries()
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');
        } catch (error) {

            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }

    async reloadForClientId(clientId) {

        try {
            this.clientId = clientId
            await this.getUserDetails()
            this.checkUserInfo()
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');
        } catch (error) {

            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }

    async setIndex(val) {
        if (val == "prev") {
            this.errorMessage = false
            this.index = this.index - 1
        } else {
            if (this.answerObject.answer_type == 'html_content' && ($('input').val() == 0 || $('input').val() == null)) {
                this.errorMessage = true;
                this.changeDetector.detectChanges()
            } else {
                this.errorMessage = false
                this.index = this.index + 1;
                if (this.answerObject.answer_type == 'html_content') {
                    this.answerObject.answer = $('input').val();
                }
            }
        }
        await this.setQuestionnaries()
    }

    setvalue(value) {
        this.answerObject.answer = value;
    }

    async setQuestionnaries() {
        if (this.riskProfileQuestionnaries.length > 0) {
            this.questionaries = this.riskProfileQuestionnaries[this.index]
            if (this.questionaries.answer_type == 'radio_opts') {
                this.options = JSON.parse(this.questionaries.options);
            } else if (this.questionaries.answer_type == 'html_content') {
                this.options = unescapeJs(this.questionaries.options);
            } else if (this.questionaries.answer_type = 'table_radio_opts') {
                const opts = JSON.parse(this.questionaries.options);
                this.tableRadioOptions = {
                    thead: [],
                    tbody: []
                };
                for (let i = 0; i < opts.length; i++) {
                    const recs = opts[i].split(/\r?\n/g);
                    if (recs.length > 1) {
                        const hdrs = this.prepareData(recs[0]);
                        this.tableRadioOptions.thead = hdrs;
                    }
                    const data = this.prepareData((recs.length > 1 ? recs[1] : recs[0]));
                    this.tableRadioOptions.tbody.push(data);
                }
            }

            if (this.answers[this.index]) {

                this.answerObject = this.answers[this.index]
                this.answerObject.answer = this.answerObject.answer;
                if (this.questionaries.answer_type == 'html_content') {
                    this.setHtmlContentAnswert(this.answerObject.answer, this.options);
                }
            } else {

                this.answerObject = new RiskProfileAnswer()
                this.answerObject.question_id = this.questionaries.id
                this.answerObject.answer_type = this.questionaries.answer_type
                this.answerObject.answer = 0;
            }

            this.answers[this.index] = this.answerObject;

        }
    }

    prepareData(commaOrTabSeparatedString) {
        var dataVal = commaOrTabSeparatedString;
        var valArr = [];
        if (dataVal.indexOf(',') != -1) {
            valArr = dataVal.split(',');
        } else {
            valArr = dataVal.split('\t');
        }
        return valArr;
    }

    async getUserDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.userDetails = parser.deserialize(response.client, Client);
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
            throw error;
        }
    }

    async submitAnswers() {
        this.loadingOnSubmit = true;
        try {
            const answers = JSON.stringify(this.answers);
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + this.clientId + '/risk-profile/analyse', {
                "answers": this.answers
            });
            this.loadingOnSubmit = false;
            this.dialogRef.close(response);
        } catch (error) {
            this.loadingOnSubmit = false;
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }

    }

    closeDialog() {
        this.dialogRef.close();
    }

    checkUserInfo() {
        if (this.userDetails.pan == undefined || this.userDetails.companyAddress.addressLine1 == undefined || this.userDetails.companyAddress.country == undefined || this.userDetails.companyAddress.city == undefined) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = "Personal Information is not filled"
            this.errorHandling.buttonText = "Click to fill Personal Information"
        }
    }

    retry() {
        this.loadData()
    }

    setHtmlContentAnswert(answer, options) {
        $('#html_content').html(options);
        $(function () {
            const qHTML = $('#html_content');
            const qType = qHTML.find('.hq').attr('hq'); // 1,2,3 as on 28-01-2018
            qHTML.find('[field=answer]').val(answer);
            let answerArray;
            switch (qType) {
                case '1':
                    answerArray = answer.toString().split('');
                    const cbs = qHTML.find('.hq').find('.fa-checkbox');
                    for (let c = 0; c < cbs.length; c++) {
                        if (answerArray[c] == 1) {
                            $(cbs[c]).toggleClass('fa-check-square fa-square-o');
                        }
                    }
                    break;
                case '2':
                    answerArray = answer.toString().split('');
                    const rgs = qHTML.find('.hq').find('.radio-group');
                    for (let c = 0; c < rgs.length; c++) {
                        const rs = $(rgs[c]).find('.fa-radio');
                        $(rs[answerArray[c] - 1]).toggleClass('fa-dot-circle-o fa-circle-o');
                    }
                    break;

                default:
                    break;
            }
        });

    }

}


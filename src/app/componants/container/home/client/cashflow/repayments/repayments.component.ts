import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { Asset } from '../../../../../../model/asset/asset';
import { Liability } from '../../../../../../model/liability/liability';
import { FormatterService } from 'app/services/formatter.service';
import { HttpService } from '../../../../../../services/http.service';
import { Client } from '../../../../../../model/client';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../../../../model/parsers/json-convert';
import { MessageService } from '../../../../../../services/message.service';

@Component({
    selector: 'app-repayments',
    templateUrl: './repayments.component.html',
    styleUrls: ['./repayments.component.css']
})

export class RepaymentsComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Input('clientId') clientId: string;

    isErrorOccured = true;
    liabilities = [];
    liabilityInfo: any;
    formatter = new FormatterService();
    cols: any[];

    constructor(
        private httpService: HttpService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        this.cols = [
            { header: 'Name' },
            { header: 'Committed Repayment Type' },
            { header: 'Amount (per annum in ₹)' }
        ];
        this.getCommittedRepaymentsDetails();
    }

    async getCommittedRepaymentsDetails() {
        this.messageService.sendMessage('show-loading');

        try {
            const liabilityResponse = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/liability`, null);
            const parser = new JsonConvert();
            const liabilities = parser.deserializeArray(liabilityResponse.liabilities, Liability)
            this.liabilities = liabilities
            this.configureCommittedRepayments(this.liabilities)
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message;
            this.messageService.sendMessage('hide-loading');
        }
    }

    configureCommittedRepayments(liabilities) {
        this.liabilityInfo = Liability.calculateLiabilityDataForCashflow(liabilities);
    }

    displayCurrency(amount) {
        return this.formatter.currencyFormatter(amount);
    }

    displayAmount(repayments) {
        return repayments.displayAmountInPerAnnum(repayments.amount, repayments.frequency);
    }

    retry() {
        this.getCommittedRepaymentsDetails();
    }

}

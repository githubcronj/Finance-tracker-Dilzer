import { Component, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
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
    selector: 'app-savings',
    templateUrl: './savings.component.html',
    styleUrls: ['./savings.component.css']
})

export class SavingsComponent implements OnInit {

    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    isErrorOccured = true;
    assets = [];
    committedSavingInfo;
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
            { header: 'Committed Saving Type' },
            { header: 'Amount (per annum in ₹)' }
        ];
        this.getCommittedSavingDetails();
    }

    async getCommittedSavingDetails() {
        this.messageService.sendMessage('show-loading');

        try {
            const assetResponse = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/asset`, null);
            const parser = new JsonConvert();
            const assets = parser.deserializeArray(assetResponse.assets, Asset);
            this.assets = assets;
            this.configureCommittedSavings(this.assets)
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message;
            this.messageService.sendMessage('hide-loading');
        }
    }

    configureCommittedSavings(assets) {
        this.committedSavingInfo = Asset.calculateCommittedSavingsData(assets);
    }

    displayCurrency(amount) {
        return this.formatter.currencyFormatter(amount);
    }

    displayAmount(savings) {
        return savings.displayAmountInPerAnnum(savings.amount,savings.frequency); 
    }

    retry () {
        this.getCommittedSavingDetails();
    }


}

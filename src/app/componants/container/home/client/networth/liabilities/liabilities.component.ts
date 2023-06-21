
import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { LiabilitiesViewModel } from './liabilities-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { Router } from '@angular/router';
import { ERROR_COLLECTOR_TOKEN } from '@angular/platform-browser-dynamic/src/compiler_factory';


@Component({
    selector: 'app-liabilities',
    templateUrl: './liabilities.component.html',
    styleUrls: ['./liabilities.component.css']
})

export class LiabilitiesComponent implements OnInit {

    editEnable = false;
    editButtonText = 'Edit';
    isErrorOccured = false;
    msgs = [];
    cols = [
        { header: 'Liability Name' },
        { header: 'Liability Type' },
        { header: 'Owner' },
        { header: 'Outstanding Loan Amount' },
        { header: 'Rate Of Interest' },
        { header: 'EMI Payable' },
        { header: 'Date Of Valuation' }
    ];


    @Input('client') client;
    @Input('clientId') clientId: string;
    @Input('kind') kind: String;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Output() routeBackEvent: EventEmitter<any> = new EventEmitter();

    constructor(private changeDetector: ChangeDetectorRef, public liabilitiesViewModel: LiabilitiesViewModel,
        private messageService: MessageService, public resources: ResourcesService, private router: Router
    ) {

    }
    ngOnInit() {
        this.liabilitiesViewModel.clientId = this.clientId;
        this.liabilitiesViewModel.clientDetails = this.client;

        this.loadData();
    }

    async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            this.liabilitiesViewModel.kind = this.kind
            await this.liabilitiesViewModel.getLiabilities(this.kind)
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"

        }
    }

    showLiabilityDetails(id) {
        this.router.navigate(['/auth/client/' + this.clientId + '/liability/' + id])
    }

    selectDeselectAll(event) {
        this.liabilitiesViewModel.selectDeselectAll(event.target.checked)
    }

    searchLiabilityList() {
        this.liabilitiesViewModel.searchLiabilityList()
    }

    async deleteLiability(id) {
        try {
            let response = await this.liabilitiesViewModel.deleteLiability(id);
            if (response) {
                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
            }
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    deleteSelectedLiabilities(id) {
        try {
            this.liabilitiesViewModel.deleteSelectedLiabilities();
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }

    editLiabilitiesDetail() {
        if (!this.editEnable) {
            this.editButtonText = 'Cancel';
            this.editEnable = true;
            window.scroll(0, 0);
            const contanierHolder = document.querySelector('.ui-table-scrollable-body');
            if (contanierHolder != null) {
                contanierHolder.scrollLeft = 0;
            }
        } else {
            this.editButtonText = 'Edit'
            this.editEnable = false;
        }
    }

    routeBack() {
        this.routeBackEvent.emit();
    }
}

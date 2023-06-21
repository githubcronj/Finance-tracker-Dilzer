import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { IncomesListViewModel } from './incomes-list-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-incomes',
    templateUrl: './incomes.component.html',
    styleUrls: ['./incomes.component.css']
})


export class IncomesComponent implements OnInit {


    editEnable = false;
    editButtonText = 'Edit';
    isErrorOccured = false;
    msgs = [];
    cols = [
        { header: 'Income Name' },
        { header: 'Income Type' },
        { header: 'Owner' },
        { header: 'Amount (per annum in ₹)' },
        { header: 'Growth Rate' },
        { header: 'Date Of Valuation' }
    ];

    @Input('clientId') clientId: string;
    @Input('kind') kind: String;
    @Input('client') client: String;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Output() routeBackEvent: EventEmitter<any> = new EventEmitter();


    constructor(private changeDetector: ChangeDetectorRef,
        public incomesListViewModel: IncomesListViewModel,
        private messageService: MessageService,
        public resources: ResourcesService,
        private router: Router
    ) { }


    ngOnInit() {
        this.incomesListViewModel.clientId = this.clientId;
        this.incomesListViewModel.clientDetails = this.client;
        this.loadData();
    }


    async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            this.incomesListViewModel.kind = this.kind;
            await this.incomesListViewModel.getIncomes(this.kind)
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true;
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
            this.errorHandling.buttonText = "Retry";
        }
    }


    showIncomeDetails(id) {
        this.router.navigate(['/auth/client/' + this.clientId + '/income/' + id])
    }


    selectDeselectAll(event) {
        this.incomesListViewModel.selectDeselectAll(event.target.checked)
    }


    searchIncomeList() {
        this.incomesListViewModel.searchIncomeList();
    }


    deleteIncome(id) {
        try {
            this.incomesListViewModel.deleteIncome(id);
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    deleteSelectedIncomes(id) {
        try {
            this.incomesListViewModel.deleteSelectedIncomes();
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    editIncomesDetail() {
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


    retry() {
        this.loadData();
    }
}

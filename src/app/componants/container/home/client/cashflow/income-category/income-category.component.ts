import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { IncomeCategoryViewModel } from './income-category-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-income-category',
    templateUrl: './income-category.component.html',
    styleUrls: ['./income-category.component.css']
})


export class IncomeCategoryComponent implements OnInit {

    @Output() showIncomeDetail: EventEmitter<any> = new EventEmitter();
    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    isErrorOccured = false;
    cols: any[];


    constructor(private changeDetector: ChangeDetectorRef,
        public incomeCategoryViewModel: IncomeCategoryViewModel,
        private messageService: MessageService,
        public resources: ResourcesService,
        private router: Router
    ) { }


    async ngOnInit() {
        this.cols = [
            { header: 'Income Name' },
            { header: 'Amount (per annum in ₹)' },
        ];
        this.incomeCategoryViewModel.clientId = this.clientId;
        await this.loadData();
    }


    private async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.incomeCategoryViewModel.getIncomes();
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = false;
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true;
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
            this.errorHandling.buttonText = "Retry";
        }
    }


    public showIncomesDetails(kind) {
        this.showIncomeDetail.emit(kind);
    }


    public didClickAddIncome() {
        this.router.navigate(['/auth/client/' + this.clientId + '/add-income']);
    }


    public async retry() {
        await this.loadData();
    }

}

import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { ExpenseCategoryViewModel } from './expense-category-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-expense-category',
    templateUrl: './expense-category.component.html',
    styleUrls: ['./expense-category.component.css']
})


export class ExpenseCategoryComponent implements OnInit {


    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    public isErrorOccured = false;
    public cols = [
        { header: 'Expense Name' },
        { header: 'Current Living Expenses (per annum in ₹)' },
        { header: 'Early Retirement Expenses (per annum in ₹)' },
        { header: 'Late Retirement Expenses (per annum in ₹)' }
    ];


    constructor(private changeDetector: ChangeDetectorRef,
        public expenseCategoryViewModel: ExpenseCategoryViewModel,
        private messageService: MessageService,
        public resources: ResourcesService,
        private router: Router
    ) { }


    async ngOnInit() {
        this.expenseCategoryViewModel.clientId = this.clientId;
        await this.loadData();
    }


    private async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.expenseCategoryViewModel.getExpenses();
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


    public showExpenseDetails(expense) {
        this.router.navigate(['/auth/client/' + this.clientId + '/edit-expenses/' + expense.kind]);
    }


    public didClickAddExpense() {
        this.router.navigate(['/auth/client/' + this.clientId + '/add-expenses']);
    }


    public async retry() {
        await this.loadData();
    }

}

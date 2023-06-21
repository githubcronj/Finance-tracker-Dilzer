import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { GoalsListViewModel } from './goals-list-view-model';
import { Router } from '@angular/router';


@Component({
    selector: 'app-goals-list',
    templateUrl: './goals-list.component.html',
    styleUrls: ['./goals-list.component.css']
})


export class GoalsListComponent implements OnInit {


    @Input('clientId') public clientId: string;
    @ViewChild('errorHandling') public errorHandling: ErrorHandlingComponent;

    isErrorOccured = false;
    editEnable = false;
    editButtonText = 'Edit';
    msgs = [];
    cols = [
        { header: 'Goal Name' },
        { header: 'Goal Type' },
        { header: 'Owner' },
        { header: 'Present Value Of Goal Expense (per annum in ₹)' },
        { header: 'Inflation Rate (per annum in %)' },
        { header: 'Goal Start Date' },
        { header: 'Goal End Date' },
        { header: 'Date Of Valuation' }
    ];


    constructor(
        public goalsListViewModel: GoalsListViewModel,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
        public resources: ResourcesService,
        private router: Router
    ) { }


    async ngOnInit() {
        await this.loadData();
    }


    private async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            this.goalsListViewModel.clientId = this.clientId;
            await this.goalsListViewModel.getGoals();
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


    public didShowGoalDetails(goalId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/goal/' + goalId]);
    }


    public async deleteGoal(goalId) {
        try {
            await this.goalsListViewModel.deleteGoal(goalId);
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    async didReorderTableRows(event) {
        try {
            let response = await this.goalsListViewModel.swapGoalsPriority();
            this.msgs = [{ severity: 'success', summary: 'Success', detail: response.message }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    public async deleteSelectedGoals() {
        try {
            await this.goalsListViewModel.deleteSelectedGoals();
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    public didEditGoalDetails() {
        if (!this.editEnable) {
            this.editButtonText = 'Cancel';
            this.editEnable = true;
            window.scroll(0, 0);
            const contanierHolder = document.querySelector('.ui-table-scrollable-body');
            if (contanierHolder != null) {
                contanierHolder.scrollLeft = 0;
            }
        } else {
            this.editButtonText = 'Edit';
            this.editEnable = false;
        }
    }


    public didSelectDeselectAllGoals(event) {
        this.goalsListViewModel.selectDeselectAll(event.target.checked)
    }


    public searchGoalsList() {
        this.goalsListViewModel.searchGoalsList();
    }


    public retry() {
        this.loadData();
    }

}
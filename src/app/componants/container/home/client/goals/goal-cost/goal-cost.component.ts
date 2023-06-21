import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { GoalsListViewModel } from '../goals-list/goals-list-view-model';
import { Router } from '@angular/router';


@Component({
    selector: 'app-goal-cost',
    templateUrl: './goal-cost.component.html',
    styleUrls: ['./goal-cost.component.css']
})


export class GoalCostComponent implements OnInit {


    @Input('clientId') public clientId: string;
    @ViewChild('errorHandling') public errorHandling: ErrorHandlingComponent;

    isErrorOccured = false;
    msgs = [];
    cols = [
        { header: 'Goal Name' },
        { header: 'Goal Type' },
        { header: 'Present Value Of Goal Expense (per annum in ₹)' },
        { header: 'Corpus Required At Start Of Goal' },
        { header: 'Projected Amount At Start Of Goal Year' },
        { header: 'Percentage Goal Funded' }
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


    public retry() {
        this.loadData();
    }

}
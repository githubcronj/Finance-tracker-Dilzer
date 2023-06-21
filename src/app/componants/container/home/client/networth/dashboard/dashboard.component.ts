import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { LoadingComponent } from '../../../../../loading/loading.component'
import { DashboardViewModel } from './dashboard-view-model'
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../services/message.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    isErrorOccured = false

    constructor(private messageService: MessageService, public dashboardViewModel: DashboardViewModel, private router: Router, private changeDetector: ChangeDetectorRef) {
    }

    async ngOnInit() {

        this.dashboardViewModel.clientId = this.clientId
        this.loadData()

    }

    async loadData() {

        try {

            this.messageService.sendMessage('show-loading');
            await this.dashboardViewModel.getNetworth()
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');

        } catch (error) {

            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"

        }

    }

    navigate(index) {
        if (index == 0) {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 2, selectedSubIndex: 1 } });
        } else if (index == 1) {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 2, selectedSubIndex: 2 } });
        } else {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 2, selectedSubIndex: 3 } });
        }
    }

    retry() {
        this.loadData()
    }



}

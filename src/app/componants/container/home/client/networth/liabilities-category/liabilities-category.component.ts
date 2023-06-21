import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { LiabilitiesCategoryViewModel } from './liabilities-category-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';


@Component({
    selector: 'app-liabilities-category',
    templateUrl: './liabilities-category.component.html',
    styleUrls: ['./liabilities-category.component.css']
})

export class LiabilitiesCategoryComponent implements OnInit {

    editEnable = false;
    editButtonText = 'Edit';
    isErrorOccured = false;


    @Output() showLiabilitiesDetails: EventEmitter<any> = new EventEmitter();

    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    constructor(private changeDetector: ChangeDetectorRef, public liabilitiesCategoryViewModel: LiabilitiesCategoryViewModel,
        private messageService: MessageService, public resources: ResourcesService,
    ) {

    }
    async ngOnInit() {
        this.liabilitiesCategoryViewModel.clientId = this.clientId;
        await this.loadData();
    }

    async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.liabilitiesCategoryViewModel.getLiabilities();
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

    showLiabilities(kind) {
        this.showLiabilitiesDetails.emit(kind);
    }

    retry() {
        this.loadData()
    }

}

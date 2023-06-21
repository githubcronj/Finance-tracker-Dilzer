import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { AssetCategoryViewModel } from './asset-category-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';


@Component({
    selector: 'app-asset-category',
    templateUrl: './asset-category.component.html',
    styleUrls: ['./asset-category.component.css']
})

export class AssetCategoryComponent implements OnInit {

    editEnable = false;
    editButtonText = 'Edit';
    isErrorOccured = false;
  

    @Output() showAssetsDetails: EventEmitter<any> = new EventEmitter();

    @Input('clientId') clientId: string;
    @Input('assetCategoryType') assetCategoryType: Number;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    constructor(private changeDetector: ChangeDetectorRef, public assetCategoryViewModel: AssetCategoryViewModel,
        private messageService: MessageService, public resources: ResourcesService,
    ) {

    }
    async ngOnInit() {
        this.assetCategoryViewModel.clientId = this.clientId;
        this.assetCategoryViewModel.assetCategoryType = this.assetCategoryType;
        await this.loadData();
    }

    async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            await this.assetCategoryViewModel.getAssets();
            this.isErrorOccured = false;
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true;
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"

        }
    }

    showAssets(kind) {
        this.showAssetsDetails.emit(kind);
    }

    retry() {
        this.loadData();
    }

}

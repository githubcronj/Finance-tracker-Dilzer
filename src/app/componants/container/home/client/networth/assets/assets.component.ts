
import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component'
import { AssetsViewModel } from './assets-view-model';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.css']
})

export class AssetsComponent implements OnInit {

    editEnable = false;
    editButtonText = 'Edit';
    isErrorOccured = false;
    msgs = [];

    @Input('clientId') clientId: string;
    @Input('assetCategoryType') assetCategoryType: Number;
    @Input('kind') kind: String;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Output() routeBackEvent: EventEmitter<any> = new EventEmitter();
    @Input('client') client;

    cols = [
        { header: 'Asset Name' },
        { header: 'Asset Type' },
        { header: 'Owner' },
        { header: 'Current Valuation' },
        { header: 'Committed Savings (per annum in ₹)' },
        { header: 'Date Of Valuation' }
    ];

    constructor(private changeDetector: ChangeDetectorRef, public assetsViewModel: AssetsViewModel,
        private messageService: MessageService, public resources: ResourcesService, private router: Router
    ) {

    }
    ngOnInit() {
        this.assetsViewModel.clientId = this.clientId;
        this.assetsViewModel.clientDetails = this.client;
        this.loadData();
    }

    async loadData() {
        try {
            this.messageService.sendMessage('show-loading');
            this.assetsViewModel.kind = this.kind
            await this.assetsViewModel.getAssets(this.kind)
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

    retry() {
        this.loadData()
    }

    showAssetDetails(id) {
        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + id])
    }

    selectDeselectAll(event) {
        this.assetsViewModel.selectDeselectAll(event.target.checked)
    }

    searchAssetList() {
        this.assetsViewModel.searchAssetList()
    }

    deleteAsset(id) {
        try {
            this.assetsViewModel.deleteAsset(id);
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }


    deleteSelectedAssets(id) {
        try {
            this.assetsViewModel.deleteSelectedAssets();
            this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }
    }

    editAssetsDetail() {
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

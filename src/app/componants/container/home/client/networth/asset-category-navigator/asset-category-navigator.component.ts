import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { AssetCategoryComponent } from '../asset-category/asset-category.component';

@Component({
    selector: 'app-asset-category-navigator',
    templateUrl: './asset-category-navigator.component.html',
    styleUrls: ['./asset-category-navigator.component.css']
})

export class AssetCategoryNavigatorComponent implements OnInit {

    @Input('clientId') clientId: string;
    @Input('assetCategoryType') assetCategoryType: Number;
    @ViewChild('assetCategory') assetCategory: AssetCategoryComponent;
    @Input('client') client;
    
    showAssetCategory = true;
    assetKind: String;

    constructor(
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
    ) { }

    async ngOnInit() {

    }

    routeBack() {
        this.showAssetCategory = true;
    }

    showAssets(kind) {
        this.assetKind = kind;
        this.showAssetCategory = false;
    }

    showAssetsCategory() {
        this.showAssetCategory = true;
    }

}

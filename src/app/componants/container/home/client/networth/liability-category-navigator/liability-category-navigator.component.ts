import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { LiabilitiesCategoryComponent } from '../liabilities-category/liabilities-category.component';

@Component({
    selector: 'app-liability-category-navigator',
    templateUrl: './liability-category-navigator.component.html',
    styleUrls: ['./liability-category-navigator.component.css']
})

export class LiabilityCategoryNavigatorComponent implements OnInit {

    @Input('clientId') clientId: string;
    @Input('client') client;

    showLiabilitiesCategory = true;
    liabilityKind: String;

    constructor(
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
    ) { }

    async ngOnInit() {
       
    }
    
    routeBack() {
        this.showLiabilitiesCategory = true;
    }

    showLiabilities(kind) {
        this.liabilityKind = kind;
        this.showLiabilitiesCategory = false;
    }

    showLiabilityCategory() {
        this.showLiabilitiesCategory = true;
    }

}

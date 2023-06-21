import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { IncomeCategoryComponent } from '../income-category/income-category.component';


@Component({
    selector: 'app-income-category-navigator',
    templateUrl: './income-category-navigator.component.html',
    styleUrls: ['./income-category-navigator.component.css']
})


export class IncomeCategoryNavigatorComponent implements OnInit {


    @Input('clientId') clientId: string;
    @Input('client') client: string;
    @ViewChild('incomeCategory') incomeCategory: IncomeCategoryComponent;

    showIncomeCategory = true;
    incomeKind: String;


    constructor(
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
    ) { }


    async ngOnInit() {

    }


    showIncomes(kind) {
        this.incomeKind = kind;
        this.showIncomeCategory = false;
    }


    routeBack() {
        this.showIncomeCategory = true;
    }

}

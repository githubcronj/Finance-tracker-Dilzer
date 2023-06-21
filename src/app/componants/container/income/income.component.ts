import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod, ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { NavbarComponent } from '../navbar/navbar.component';
import { KeychainService } from '../../../services/keychain.service';
import { ResourcesService } from '../../../services/resources.service';
import { saveAs } from 'file-saver';
import { Income } from '../../../model/income/income'
import { Client } from '../../../model/client';
import { Asset } from '../../../model/asset/asset'
import { IncomeDetailTranslations } from './income.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.css']
})


export class IncomeComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    preLoader;
    editIncomeInformation = '';
    clientId;
    incomeId;
    msgs = [];
    incomeInformation: any;
    incomeDetailTranslations = IncomeDetailTranslations
    beneficiaryDetailsSectionHideShow = false
    isErrorOccured = false
    associatedAssets = [];
    associatedAssetName;
    ownerName;
    ownerOfResourceList;



    constructor(
        public keychainService: KeychainService,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        public resources: ResourcesService,
        private changeDetector: ChangeDetectorRef,
        private messageService: MessageService
    ) { }


    async ngOnInit() {
        this.loadData()
    }

    async loadData() {

        try {

            this.navbar.routeBackTitle = 'Incomes';
            this.navbar.isBorderEnabled = true;
            this.clientId = this.route.snapshot.params['clientId'];
            this.incomeId = this.route.snapshot.params['incomeId'];
            this.editIncomeInformation = '/auth/client/' + this.clientId + '/edit-income/' + this.incomeId;

            if (this.keychainService.isLoggedInAsAdmin()) {

                this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

            } else {
                this.navbar.routeBackPath = "/auth/home";

            }
            this.navbar.routeBackQueryParams = { selected: 3, selectedSubIndex: 1 };
            this.messageService.sendMessage('show-loading');
            const parser = new JsonConvert()
            const responseClietDetails = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            let userDetails = parser.deserialize(responseClietDetails.client, Client);
            this.navbar.title = userDetails.name.fullName();
            this.navbar.subTitle = userDetails.email;
            this.ownerOfResourceList = userDetails.ownerOfResourceList();

            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/income/' + this.incomeId, null);
            this.incomeInformation = parser.deserialize(response.income, Income);
            await this.getAssociatedAssetDetails()

            if (this.incomeInformation.owners.length > 1) {
                this.ownerName = this.getOwnerName(this.incomeInformation.owners[0] + '&' + this.incomeInformation.owners[1]);
            } else {
                this.ownerName = this.getOwnerName(this.incomeInformation.owners[0])
            }
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }

    getOwnerName(id) {
        for (let owner of this.ownerOfResourceList) {
            if (id == owner.key) {

                return owner.value;
            }
        }
    }

    retry() {
        this.loadData()
    }

    async getAssociatedAssetDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/asset`, null);
            let parser = new JsonConvert()
            this.associatedAssets = parser.deserializeArray(response.assets, Asset)
            for (let asset of this.associatedAssets) {
                if (asset._id == this.incomeInformation.associatedAsset) {
                    this.associatedAssetName = asset.name
                }
            }
        } catch (error) {
            throw error
        }
    }

    async addAttachment(event) {
        const files = event.target.files || event.srcElement.files;
        const file = files[0];
        let formData = new FormData();
        formData.append('file', file);

        try {
            const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/income/' + this.incomeId + '/attachment', formData);
            const parser = new JsonConvert()
            this.incomeInformation = parser.deserialize(response.income, Income);
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }

    }


    async deleteAttachment(attachmentId) {
        if (confirm('Are you sure you want to delete this attachment?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, '/client/' + this.clientId + '/income/' + this.incomeId + '/attachment/' + attachmentId, null)
                const parser = new JsonConvert()
                this.incomeInformation = parser.deserialize(response.income, Income);
                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
            } catch (error) {
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }


    async downloadAttachment(attachmentId, fileName, mimetype) {

        if (confirm('Are you sure you want to download this attachment?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/income/' + this.incomeId + '/attachment/' + attachmentId, null, ResponseContentType.Blob)
                let file = response.blob()
                file.name = fileName
                saveAs(file);
            } catch (error) {
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }


}
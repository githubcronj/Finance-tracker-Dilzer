import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod, ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommittedSavingType, CommittedSavingTypeUtils } from '../../../model/enum/asset/committed-saving.enum';
import { HttpService } from '../../../services/http.service';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { NavbarComponent } from '../navbar/navbar.component';
import { KeychainService } from '../../../services/keychain.service';
import { ResourcesService } from '../../../services/resources.service';
import { Liability } from '../../../model/liability/liability'
import { saveAs } from 'file-saver';
import { Asset } from '../../../model/asset/asset'
import { Client } from '../../../model/client';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';



@Component({
    selector: 'app-liability',
    templateUrl: './liability.component.html',
    styleUrls: ['./liability.component.css']
})


export class LiabilityComponent implements OnInit {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    userLiabilities;
    preLoader;
    editLiabilityInformation = '';
    clientId;
    client;
    liabilityId;
    msgs = [];
    associatedAssets = [];
    liabilityInformation: any;
    associatedAssetName;
    isErrorOccured = false;
    ownerOfResourceList;
    ownerName;


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
            this.navbar.routeBackTitle = 'Liabilities';
            this.navbar.isBorderEnabled = true;
            this.clientId = this.route.snapshot.params['clientId'];
            this.liabilityId = this.route.snapshot.params['liabilityId'];
            this.editLiabilityInformation = '/auth/client/' + this.clientId + '/edit-liability/' + this.liabilityId;
            if (this.keychainService.isLoggedInAsAdmin()) {

                this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

            } else {
                this.navbar.routeBackPath = "/auth/home";

            }
            this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 3 };

            this.messageService.sendMessage('show-loading');
            const parser = new JsonConvert()
            const responseClientDetails = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            this.client = parser.deserialize(responseClientDetails.client, Client);
            this.navbar.title = this.client.name.fullName();
            this.navbar.subTitle = this.client.email;
            this.ownerOfResourceList = this.client.ownerOfResourceList();


            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
            this.liabilityInformation = parser.deserialize(response.liability, Liability);


            if (this.liabilityInformation.owners.length > 1) {
                this.ownerName = this.getOwnerName(this.liabilityInformation.owners[0] + '&' + this.liabilityInformation.owners[1]);
            } else {
                this.ownerName = this.getOwnerName(this.liabilityInformation.owners[0])
            }

            await this.getAssociatedAssetDetails()
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
        }
    }

    retry() {
        this.loadData()
    }

    getOwnerName(id) {

        for (let owner of this.ownerOfResourceList) {
            if (id == owner.key) {

                return owner.value;
            }

        }
    }

    async getAssociatedAssetDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/asset`, null);
            let parser = new JsonConvert()
            this.associatedAssets = parser.deserializeArray(response.assets, Asset)
            for (let asset of this.associatedAssets) {
                if (asset._id == this.liabilityInformation.associatedAsset) {
                    this.associatedAssetName = asset.name
                }
            }
        } catch (error) {
            throw error
        }
    }


    async addAttachments(event) {
        const files = event.target.files || event.srcElement.files;
        const file = files[0];
        let formData = new FormData();
        formData.append('file', file);

        try {
            const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/attachment', formData);
            const parser = new JsonConvert()
            this.liabilityInformation = parser.deserialize(response.liability, Liability);
        } catch (error) {
            if (error.message) {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }
        }

    }


    async deleteAttachments(attachmentId) {
        if (confirm('Are you sure you want to delete this attachment?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, '/client/' + this.clientId + '/liability/' + this.liabilityId + '/attachment/' + attachmentId, null)
                const parser = new JsonConvert()
                this.liabilityInformation = parser.deserialize(response.liability, Liability);
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


    async downloadAttachments(attachmentId, fileName, mimetype) {

        if (confirm('Are you sure you want to download this attachment?') == true) {
            try {

                const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/attachment/' + attachmentId, null, ResponseContentType.Blob)
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


    editCommittedRepayments(committedRepaymentId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/liability/' + this.liabilityId + '/committed-repayment/' + committedRepaymentId]);
    }


    async deleteCommittedRepayments(committedRepaymentId) {
        if (confirm('Are you sure you want to delete this committed Repayment?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/committedRepayment/' + committedRepaymentId, null);
                const parser = new JsonConvert()
                this.liabilityInformation = parser.deserialize(response.liability, Liability);
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


    editLoanStage() {
        this.router.navigate(['/auth/client/' + this.clientId + '/liability/' + this.liabilityId + '/current-stage']);
    }


    async deleteLoanStage(loanStageId) {
        if (confirm('Are you sure you want to delete this loan stage?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/stage/' + loanStageId, null);
                const parser = new JsonConvert()
                this.liabilityInformation = parser.deserialize(response.liability, Liability);
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


    displayKind(kind) {
        return CommittedSavingTypeUtils.getCommittedSavingTypeText(kind, false);
    }

}
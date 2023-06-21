import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod, ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommittedSavingType, CommittedSavingTypeUtils } from '../../../model/enum/asset/committed-saving.enum';
import { HttpService } from '../../../services/http.service';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { Asset } from '../../../model/asset/asset';
import { Client } from '../../../model/client';
import { AssetType } from '../../../model/enum/asset/asset-type.enum';
import { NavbarComponent } from '../navbar/navbar.component';
import { KeychainService } from '../../../services/keychain.service';
import { ResourcesService } from '../../../services/resources.service';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { saveAs } from 'file-saver';
import 'rxjs/Rx';
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

    userAssets;
    preLoader;
    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    editAssetInformation = '';
    clientId;
    client;
    assetId;
    committedSavingType = CommittedSavingType;
    msgs = [];
    assetInformation: any;
    insuranceSectionHideShow = false
    survivalBenefitHideShow = false
    describeAssetRowHideShow = false
    isErrorOccured = false
    rateOfReturnButton;
    ownerOfResourceList;
    ownersName;

    constructor(
        public keychainService: KeychainService,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        public resources: ResourcesService,
        private changeDetector: ChangeDetectorRef,
        private messageService: MessageService
    ) {
    }

    async ngOnInit() {
        await this.loadData()

    }

    async loadData() {

        try {
            this.navbar.isBorderEnabled = true;
            this.clientId = this.route.snapshot.params['clientId'];
            this.assetId = this.route.snapshot.params['assetId'];
            this.editAssetInformation = '/auth/client/' + this.clientId + '/edit-asset/' + this.assetId;

            this.messageService.sendMessage('show-loading');
            const parser = new JsonConvert()
            const responseClient = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            this.client = parser.deserialize(responseClient.client, Client);
            this.navbar.title = this.client.name.fullName()
            this.navbar.subTitle = this.client.email;
            this.navbar.routeBackTitle = 'Assets';

            this.ownerOfResourceList = this.client.ownerOfResourceList();

            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
            this.assetInformation = parser.deserialize(response.asset, Asset);
            this.setButtonTitle();

            if (this.assetInformation.owners.length > 1) {
                this.ownersName = this.getOwnerName(this.assetInformation.owners[0] + '&' + this.assetInformation.owners[1]);
            } else {
                this.ownersName = this.getOwnerName(this.assetInformation.owners[0])
            }

                let otherAssets = [AssetType.RealEstate, AssetType.Gold, AssetType.PersonalAssets]

            if (this.keychainService.isLoggedInAsAdmin()) {
                this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;
            } else {
                this.navbar.routeBackPath = "/auth/home";
            }

            if (otherAssets.indexOf(this.assetInformation.kind) > -1) {
                this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 2 };
            } else {
                this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 1 };
            }

            this.hideShowInsuranceSection()
            this.hideShowSurvivalBenefit()
            this.hideShowDescribeAssetRow()

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
      
        for(let owner of this.ownerOfResourceList) {
            if(id == owner.key) {

                return owner.value;
            }

        }
    }

    retry() {
        this.loadData()
    }

    displayKind(kind) {
        return CommittedSavingTypeUtils.getCommittedSavingTypeText(kind, true);
    }

    editCommittedSavings(committedSavingId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/committed-saving/' + committedSavingId]);
    }

    editRateOfReturns(rateOfReturnId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn/' + rateOfReturnId]);
    }

    editCurrentAssetAllocation(currentAssetAllocation) {

        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/currentAssetAllocation'])

    }

    addRateOfReturns() {
        if (this.assetInformation.kind == AssetType.Insurance) {
            if (this.assetInformation && this.assetInformation.maturityDate == null) {
                this.msgs = []
                this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Please update the insurance information' }];

            } else {
                this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn'])
            }
        } else {
            this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn'])

        }

    }

    setButtonTitle() {
        if (this.assetInformation.rateOfReturns.length > 0) {
            this.rateOfReturnButton = 'Add New Rate of Return';
        } else {
            this.rateOfReturnButton = 'Add Rate of Return';
        }
    }

    editDesiredAssetAllocation(desiredAssetAllocation) {

        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/desiredAssetAllocation'])
    }

    async deleteCommittedSavings(committedSavingId) {
        if (confirm('Are you sure you want to delete this committed savings?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/asset/' + this.assetId + '/committedSaving/' + committedSavingId, null);
                const parser = new JsonConvert()
                this.assetInformation = parser.deserialize(response.asset, Asset);
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


    async editSurvivalBenefit(survivalBenefitId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + this.assetId + '/survival-benefit/' + survivalBenefitId]);
    }

    async deleteSurvivalBenefit(survivalBenefitId) {
        if (confirm('Are you sure you want to delete this Survival benefit?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, '/client/' + this.clientId + '/asset/' + this.assetId + '/survival-benefit/' + survivalBenefitId, null)
                const parser = new JsonConvert()
                this.assetInformation = parser.deserialize(response.asset, Asset);
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


    async addAttachments(event) {
        const files = event.target.files || event.srcElement.files;
        const file = files[0];
        let formData = new FormData();
        formData.append('file', file);

        try {
            const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/asset/' + this.assetId + '/attachment', formData);
            const parser = new JsonConvert()
            this.assetInformation = parser.deserialize(response.asset, Asset);
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
                const response = await this.httpService.request(RequestMethod.Delete, '/client/' + this.clientId + '/asset/' + this.assetId + '/attachment/' + attachmentId, null)
                const parser = new JsonConvert()
                this.assetInformation = parser.deserialize(response.asset, Asset);
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
                const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId + '/attachment/' + attachmentId, null, ResponseContentType.Blob)
                let file = response.blob()
                file.name = fileName
                saveAs(file);

                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Downloaded Successfully.' }];
            } catch (error) {
                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }

    async deleteRateOfReturn(rateOfReturnId) {
        if (confirm('Are you sure you want to delete this rate of return?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn/' + rateOfReturnId, null);
                const parser = new JsonConvert()
                this.assetInformation = parser.deserialize(response.asset, Asset);
                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
                this.setButtonTitle()
            } catch (error) {

                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }

    hideShowInsuranceSection() {
        if (this.assetInformation.kind == AssetType.Insurance) {
            this.insuranceSectionHideShow = true
        } else {
            this.insuranceSectionHideShow = false
        }

    }

    hideShowSurvivalBenefit() {
        if (this.assetInformation.assetSubtype == "Moneyback") {
            this.survivalBenefitHideShow = true
        } else {
            this.survivalBenefitHideShow = false
        }
    }

    hideShowDescribeAssetRow() {
        if (this.assetInformation.assetSubtype == "Other") {
            this.describeAssetRowHideShow = true
        } else {
            this.describeAssetRowHideShow = false
        }
    }

}



import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { FinanceService } from '../../../services/finance.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Liability } from '../../../model/liability/liability'
import { Asset } from '../../../model/asset/asset'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { LiabilityType, LiabilityTypeUtils } from '../../../model/enum/liability-type.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { ResourcesService } from '../../../services/resources.service';
import { AddLiabilityTranslations } from './add-liabilities.translations'
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.css']
})
export class AddLiabilitiesComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  blockHeader = 'Add Liability';
  addUpdateLiabilityButtonText = 'Add';
  loadingOnSubmit = false;
  clientId;
  liabilityId;
  msgs = [];
  liability = new Liability();
  assets = [];
  ownerOfResourceList = [];
  associatedAssetList = [];
  liabilityTypeList = LiabilityTypeUtils.getAllLiabilityType();
  isErrorOccured = false
  translations = AddLiabilityTranslations;
  tooltipTranslations = TooltipTranslations;
  ownerName;

  liabilityDetailForm = new FormGroup({
    liabilityNameControl: new FormControl(null, [Validators.required]),
    associatedAssetControl: new FormControl(null, [Validators.required]),
    liabilityOwnerControl: new FormControl(null, [Validators.required]),
    loanAmountControl: new FormControl(null, [Validators.required]),
    rateOfInterestControl: new FormControl(null, [Validators.required]),
    loanTakenDateControl: new FormControl(null, [Validators.required]),
    loanEndDateControl: new FormControl(null, [Validators.required]),
    tenureControl: new FormControl(null, [Validators.required]),
    liabilityTypeControl: new FormControl(null, [Validators.required]),
    totalAmountPaidControl: new FormControl(null, [Validators.required]),
    totalInterestPaidControl: new FormControl(null, [Validators.required]),
    outstandingAmountControl: new FormControl(null, [Validators.required]),
    preclosurePercentageControl: new FormControl(null)
  });

  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private finance: FinanceService,
    private changeDetector: ChangeDetectorRef,
    private keyChainService: KeychainService,
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }


  async ngOnInit() {
    this.loadData()

  }


  async loadData() {

    try {
      this.clientId = this.route.snapshot.params['clientId'];
      this.liabilityId = this.route.snapshot.params['liabilityId'];

      this.navbar.routeBackTitle = 'Liabilities';
      this.navbar.title = 'Add Liability';
      this.navbar.isBorderEnabled = true;


      if (this.keyChainService.isLoggedInAsAdmin()) {

        this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

      } else {
        this.navbar.routeBackPath = "/auth/home";

      }
      this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 3 };


      this.messageService.sendMessage('show-loading');
      await this.getUserDetails();
      await this.getAssociatedAssetsForClient()
      if (this.liabilityId) {
        await this.getLiabilityDetails();

        this.blockHeader = 'Edit Liability'
        this.navbar.routeBackTitle = 'Liability Information';
        this.navbar.title = 'Edit Liability';
        this.navbar.routeBackPath = `/auth/client/${this.clientId}/liability/${this.liabilityId}`;
        this.addUpdateLiabilityButtonText = 'Update';

        this.liabilityDetailForm.get('liabilityTypeControl').disable()
        this.liabilityDetailForm.get('outstandingAmountControl').disable()

      } else {
        this.liability.kind = String(this.liabilityTypeList[0].key)
        this.ownerName = this.ownerOfResourceList[0].key;
        this.liability.owners = this.ownerName
        if (this.associatedAssetList.length > 0) {
          this.liability.associatedAsset = this.associatedAssetList[0].key
        }
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
  retry() {
    this.loadData()
  }

  async getUserDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      const clientDetails = parser.deserialize(response.client, Client);
      this.navbar.subTitle = clientDetails.name.fullName();
      this.ownerOfResourceList = clientDetails.ownerOfResourceList();
    } catch (error) {
      throw error
    }
  }

  async getAssociatedAssetsForClient() {

    try {
      const response = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/asset`, null);
      let parser = new JsonConvert()
      let assets = parser.deserializeArray(response.assets, Asset)
      this.assets = assets;
      for (let asset of this.assets) {
        this.associatedAssetList.push({ key: asset._id, value: asset.name })
      }

    } catch (error) {
      throw error
    }

  }

  async getLiabilityDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
      const parser = new JsonConvert()
      this.liability = parser.deserialize(response.liability, Liability);

      if (this.liability.owners.length > 1) {
        this.ownerName = this.liability.owners[0] + '&' + this.liability.owners[1]
      } else {
        this.ownerName = this.liability.owners[0]
      }
    } catch (error) {
      throw error
    }
  }

  didChangeOwner(event) {
    this.liability.owners = event.target.value.split('&');
  }

  async createBasicLiability() {

    let validationSucceded = true;

    if (this.liability && this.liability.owners && this.liability.owners.length < 0) {
      this.liabilityDetailForm.controls['liabilityOwnerControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['liabilityOwnerControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.loanAmount) {
      this.liabilityDetailForm.controls['loanAmountControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['loanAmountControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.rateOfInterest) {
      this.liabilityDetailForm.controls['rateOfInterestControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['rateOfInterestControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.loanTakenDate) {
      this.liabilityDetailForm.controls['loanTakenDateControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['loanTakenDateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.loadEndDate) {
      this.liabilityDetailForm.controls['loanEndDateControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['loanEndDateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.preclosurePercentage) {
      this.liabilityDetailForm.controls['preclosurePercentageControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['preclosurePercentageControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.tenure) {
      this.liabilityDetailForm.controls['tenureControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['tenureControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.totalAmountPaid) {
      this.liabilityDetailForm.controls['totalAmountPaidControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['totalAmountPaidControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.totalInterestPaid) {
      this.liabilityDetailForm.controls['totalInterestPaidControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['totalInterestPaidControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability && !this.liability.currentStage.outStandingAmount) {
      this.liabilityDetailForm.controls['outstandingAmountControl'].setErrors({ 'required': true });
      this.liabilityDetailForm.controls['outstandingAmountControl'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {

      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.liabilityId) {
        url = 'client/' + this.clientId + '/liability/' + this.liabilityId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/liability';
        method = RequestMethod.Post;
      }

      try {
        const response = await this.httpService.request(method, url, this.liability);
        this.router.navigate(['/auth/client/' + this.clientId + '/liability/' + response.liability._id]);
        this.location.replaceState('/auth/client/' + this.clientId + '/liability/' + response.liability._id);
        this.loadingOnSubmit = false;
      } catch (error) {

        this.loadingOnSubmit = false;

        if (error.message) {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        } else {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
        }

      }
    }

  }


  didSelectLoanStartDateTextBox(event) {
    this.liability.loanTakenDate = event
    if (this.liability.loadEndDate) {
      if (this.liability.loadEndDate < this.liability.loanTakenDate) {
        this.liability.loadEndDate = this.liability.loanTakenDate
      }
    }
    this.autoCalculate()
  }


  didSelectLoanEndDateTextBox(event) {

    this.liability.loadEndDate = event
    this.autoCalculate()

  }

  didChangeLoanAmount(event) {
    this.liability.loanAmount = Number(event.target.value)
    this.autoCalculate()
  }

  didChangeRateOfInterest(event) {
    this.liability.rateOfInterest = Number(event.target.value)
    this.autoCalculate()
  }


  autoCalculate() {

    this.liability.calculateTenure(this.finance)

  }


  routeBack() {
    this.navbar.routeBack()
  }
}

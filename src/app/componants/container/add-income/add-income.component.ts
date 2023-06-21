import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Income } from '../../../model/income/income'
import { Asset } from '../../../model/asset/asset'
import { Beneficiary } from '../../../model/income/beneficiary'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { IncomeType, IncomeTypeUtils } from '../../../model/enum/income-type.enum';
import { AddIncomeTranslations } from './add-income.translations';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../../../model/enum/asset/committed-saving-frequency.enum'
import * as DateDiff from 'date-diff';
import { DatePipe } from '@angular/common';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { ResourcesService } from '../../../services/resources.service';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css']
})

export class AddIncomeComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  blockHeader = 'Add Income';
  childBlockHeader = 'Beneficiary Details'
  addUpdateIncomeButtonText = 'Add';
  loadingOnSubmit = false;
  showOrHideBeneficiaryDetailsSection = false;
  clientId;
  incomeId;
  msgs = [];
  minDate;
  income = new Income();
  ownerOfResourceList = [];
  familyMembers = [];
  incomeTranslations = AddIncomeTranslations;
  incomeTypeList = IncomeTypeUtils.getAllIncomeType();
  incomeFrequencyTypes = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
  associatedAssetList = [];
  assets = [];
  isErrorOccured = false
  tooltipTranslations = TooltipTranslations;
  ownerName;

  incomeDetailForm = new FormGroup({
    incomeNameControl: new FormControl(null, [Validators.required]),
    incomeOwnerControl: new FormControl(null, [Validators.required]),
    amountControl: new FormControl(null, [Validators.required]),
    growthRateControl: new FormControl(null, [Validators.required]),
    startDateControl: new FormControl(null, [Validators.required]),
    endDateControl: new FormControl(null, [Validators.required]),
    incomeTypeControl: new FormControl(null, [Validators.required]),
    frequencyControl: new FormControl(null, [Validators.required]),
    beneficiaryControl: new FormControl(null, [Validators.required]),
    associatedAssetControl: new FormControl(null, [Validators.required]),
    beneficiaryIncomeOwnerControl: new FormControl(null),
    beneficiaryIncomeAmountControl: new FormControl(null),
    beneficiaryIncomeGrowthRateControl: new FormControl(null),
    beneficiaryIncomeStartDateControl: new FormControl(null),
    beneficiaryIncomeEndDateControl: new FormControl(null),
    beneficiaryIncomeFrequencyControl: new FormControl(null),
  });

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute, private router: Router, private location: Location,
    private keyChainService: KeychainService, private changeDetector: ChangeDetectorRef, public resources: ResourcesService) {

  }


  async ngOnInit() {
    this.loadData()
  }

  async loadData() {

    let date = new Date()
    let minimumDate = new Date(date.getFullYear(), date.getMonth(), 1)
    this.minDate = minimumDate;


    this.clientId = this.route.snapshot.params['clientId'];
    this.incomeId = this.route.snapshot.params['incomeId'];
    this.navbar.routeBackTitle = 'Incomes';
    this.navbar.title = 'Add Income';
    this.navbar.isBorderEnabled = true;


    if (this.keyChainService.isLoggedInAsAdmin()) {

      this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

    } else {
      this.navbar.routeBackPath = "/auth/home";

    }
    this.navbar.routeBackQueryParams = { selected: 3, selectedSubIndex: 1 };



    if (this.income.frequency == null) {
      this.income.frequency = CommittedSavingFrequencyType.Yearly
    }

    if (this.income.kind == null) {
      this.income.kind = String(IncomeType.BusinessIncome)
    }

    try {
      this.messageService.sendMessage('show-loading');
      await this.getUserDetails();
      await this.getAssociatedAssetsForClient()

      if (this.incomeId) {
        await this.getIncomeDetails();
        if (this.income.beneficiary.amount != null) {
          this.showOrHideBeneficiaryDetailsSection = true
          this.incomeDetailForm.get('beneficiaryControl').setValue(true)
        }
        this.blockHeader = 'Edit Income'
        this.navbar.routeBackTitle = 'Income Information';
        this.navbar.title = 'Edit Income';
        this.navbar.routeBackPath = `/auth/client/${this.clientId}/income/${this.incomeId}`;
        this.addUpdateIncomeButtonText = 'Update';
        this.incomeDetailForm.get('incomeTypeControl').disable()
        if (this.income.beneficiary.growthRate == null) {
          this.income.beneficiary.growthRate = 0
        }
      } else {
        this.ownerName = this.ownerOfResourceList[0].key;
        this.income.owners = this.ownerName
        this.income.beneficiary.growthRate = 0
        if (this.associatedAssetList.length > 0) {
          this.income.associatedAsset = this.associatedAssetList[0].key
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

  didChangeOwner(event) {
    this.income.owners = event.target.value.split('&');
  }

  retry() {
    this.loadData()
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


  didEndClickForFromDateField(event) {
    if (this.income.endDate) {
      if (this.income.endDate < this.income.startDate) {
        this.income.endDate = this.income.startDate
      }
    }
  }
  didBenificiaryEndClickForFromDateField(event) {
    if (this.income.beneficiary.endDate) {
      if (this.income.beneficiary.endDate < this.income.beneficiary.startDate) {
        this.income.beneficiary.endDate = this.income.beneficiary.startDate
      }
    }
  }

  async getUserDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      const clientDetails = parser.deserialize(response.client, Client);
      this.familyMembers = clientDetails.familyMembers
      this.navbar.subTitle = clientDetails.name.fullName();
      this.ownerOfResourceList = clientDetails.ownerOfResourceList();
      this.familyMembers.push(clientDetails.spouse)

    } catch (error) {
      throw error
    }
  }


  async getIncomeDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/income/' + this.incomeId, null);
      const parser = new JsonConvert()
      this.income = parser.deserialize(response.income, Income);

      if (this.income.owners.length > 1) {
        this.ownerName = this.income.owners[0] + '&' + this.income.owners[1]
      } else {
        this.ownerName = this.income.owners[0]
      }
    } catch (error) {
      throw error
    }
  }


  async createBasicIncome() {

    let validationSucceded = true;

    if (this.income && !this.income.name) {
      this.incomeDetailForm.controls['incomeNameControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['incomeNameControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.income && this.income.owners && this.income.owners.length < 0) {
      this.incomeDetailForm.controls['incomeOwnerControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['incomeOwnerControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.income && this.income.amount == null) {
      this.incomeDetailForm.controls['amountControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['amountControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.income && this.income.growthRate == null) {
      this.incomeDetailForm.controls['growthRateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['growthRateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.income && !this.income.startDate) {
      this.incomeDetailForm.controls['startDateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['startDateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.income && !this.income.endDate) {
      this.incomeDetailForm.controls['endDateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['endDateControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && this.income.beneficiary.owner == null) {
      this.incomeDetailForm.controls['beneficiaryIncomeOwnerControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeOwnerControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && this.income.beneficiary.amount == null) {
      this.incomeDetailForm.controls['beneficiaryIncomeAmountControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeAmountControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && this.income.beneficiary.frequency == null) {
      this.incomeDetailForm.controls['beneficiaryIncomeFrequencyControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeFrequencyControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && !this.income.beneficiary.growthRate == null) {
      this.incomeDetailForm.controls['beneficiaryIncomeGrowthRateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeGrowthRateControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && !this.income.beneficiary.startDate) {
      this.incomeDetailForm.controls['beneficiaryIncomeStartDateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeStartDateControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showOrHideBeneficiaryDetailsSection && this.income && this.income.beneficiary && !this.income.beneficiary.endDate) {
      this.incomeDetailForm.controls['beneficiaryIncomeEndDateControl'].setErrors({ 'required': true });
      this.incomeDetailForm.controls['beneficiaryIncomeEndDateControl'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {

      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.incomeId) {
        url = 'client/' + this.clientId + '/income/' + this.incomeId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/income';
        method = RequestMethod.Post;
      }


      try {

        if (!this.showOrHideBeneficiaryDetailsSection) {
          this.income.beneficiary = undefined
        }

        const response = await this.httpService.request(method, url, this.income);
        this.router.navigate(['/auth/client/' + this.clientId + '/income/' + response.income._id]);
        this.location.replaceState('/auth/client/' + this.clientId + '/income/' + response.income._id);
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


  showBeneficiaryDetailsSection(event) {

    if (event.target.checked == true) {
      if (this.income.beneficiary == undefined) {
        this.income.beneficiary = new Beneficiary();
      }
      this.income.beneficiary.startDate = this.income.endDate
      this.income.beneficiary.frequency = CommittedSavingFrequencyType.Yearly
      this.income.beneficiary.owner = this.ownerOfResourceList[0].key
      this.showOrHideBeneficiaryDetailsSection = true
    } else {
      this.showOrHideBeneficiaryDetailsSection = false
      // this.income.beneficiary = undefined;
    }

  }


  didCalculateBeneficiaryEndDate() {
    let dob;
    let lifeExpectancy;
    let depEndDate

    for (let member of this.familyMembers) {
      lifeExpectancy = 0;
      if (member.name.fullName() == this.income.beneficiary.owner) {
        lifeExpectancy = member.lifeExpectancy

        if (!lifeExpectancy) {
          depEndDate = null
        } else {
          const endDate = new Date(member.dob);
          endDate.setFullYear(endDate.getFullYear() + lifeExpectancy);
          depEndDate = endDate
        }
      }
    }

    if (depEndDate < this.income.beneficiary.startDate) {
      this.income.beneficiary.endDate = null
    } else {
      this.income.beneficiary.endDate = depEndDate
    }
  }


  convertDateFormat(date) {
    if (date != null) {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'dd/MM/yyyy');
    }
  }


  routeBack() {
    this.navbar.routeBack()
  }
}

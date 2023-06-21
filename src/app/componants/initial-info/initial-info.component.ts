import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { initialInfoTranslations } from './initial-info.translations';
import { RequestMethod } from '@angular/http';
import * as cleanDeep from 'clean-deep';
import { MaritalStatus, MaritalStatusUtils } from '../../model/enum/marital-status.enum';
import { HearAboutUs, HearAboutUsUtils } from '../../model/enum/hear-about-us.enum';
import { FinancialAsset, FinancialAssetUtils } from '../../model/enum/financial-asset.enum';
import { ServiceObjective, ServiceObjectiveUtils } from '../../model/enum/service-objective.enum';
import { InitialInformation } from '../../model/initial-information';
import { CountryCodeService } from '../../services/countryCode.service';
import { HttpService } from '../../services/http.service';
import { ResourcesService } from '../../services/resources.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-initial-info',
  templateUrl: './initial-info.component.html',
  styleUrls: ['./initial-info.component.css']
})
export class InitialInfoComponent implements OnInit {

  pageTitle = "Initial Information"
  initialInfoTranslations = initialInfoTranslations;
  maritalStatusOptions = MaritalStatusUtils.getAllMaritalStatus();

  token: any;
  referenceOthers: any;
  showFinancialAssetOthers = false;
  userInfo = new InitialInformation();
  activatedSuccessFlag = false;
  activateFailureFlag = false;
  activatedMessage = initialInfoTranslations.somethingWentWrongText;
  financialAssetsOptions = FinancialAssetUtils.getAllFinancialAssets();
  loadingOnSubmit = false;
  hearAboutUs = HearAboutUsUtils.getAllHearAboutUsOptions();
  objectiveOfUtilisingService = ServiceObjectiveUtils.getAllServiceObjectives();
  initialFormShowHide = true;
  spouseInfoFormShowHide = false;
  maxDate: Date;
  minDate: Date;
  edited = false;
  countriesCode = CountryCodeService.codes();


  currencyTitleOptions = [
    { 'key': 'INR', 'value': 'INR' },
    { 'key': 'USD', 'value': 'USD' },
    { 'key': 'EURO', 'value': 'EURO' },
    { 'key': 'AUD', 'value': 'AUD' }
  ];
  familyIncome = [
    { key: 'single', value: 'Single Income' },
    { key: 'double', value: 'Double Income' }
  ];


  jobType = [
    { key: 'salaried', value: 'Salaried' },
    { key: 'professional', value: 'Professional' },
    { key: 'entrepreneur', value: 'Entrepreneur' }
  ];


  peopleDependOnYou = [
    { key: 0, value: 0 },
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
    { key: 7, value: 7 },
    { key: 8, value: 8 },
    { key: 9, value: 9 },
    { key: 10, value: 10 }
  ];

  initialInfoForm = new FormGroup({
    dobControl: new FormControl(null),
    spousefirstNameControl: new FormControl(null),
    spouselastNameControl: new FormControl(null),
    objectiveOfUtilisingServiceControl: new FormControl(null),
    hearAboutUsControl: new FormControl(null),
    companyNameControl: new FormControl(null),
    companyAddress1Control: new FormControl(null),
    companyAddress2Control: new FormControl(null),
    companylocalityControl: new FormControl(null),
    companycityControl: new FormControl(null),
    companypincodeControl: new FormControl(null),
    companycountryControl: new FormControl(null),
    designationControl: new FormControl(null),
    residentialAddress1Control: new FormControl(null, [Validators.required]),
    residentialAddress2Control: new FormControl(null),
    residentiallocalityControl: new FormControl(null),
    residentialcityControl: new FormControl(null, [Validators.required]),
    residentialpincodeControl: new FormControl(null, [Validators.required]),
    residentialcountryControl: new FormControl(null, [Validators.required]),
    officialMailControl: new FormControl(null, [Validators.required]),
    personalMailControl: new FormControl(null, [Validators.required]),
    mobileNumberControl: new FormControl(null, [Validators.required]),
    jobDescriptionControl: new FormControl(null),
    jobTypeControl: new FormControl(null),
    dilzerIsdControl: new FormControl(null),
    familyIncomeControl: new FormControl(null),
    maritalStatusControl: new FormControl(null),
    peopleDependOnYouControl: new FormControl(null),
    netAnualEarningControl: new FormControl(null, [Validators.required]),
    currency: new FormControl('INR', [Validators.required]),
    homeSelfOccupiedControl: new FormControl(null),
    financialAssetsControl: new FormControl(null),
    bestFinancialDecisionControl: new FormControl(null),
    worstFinancialDecisionControl: new FormControl(null),
    facebook: new FormControl(null),
    twitter: new FormControl(null),
    googleplus: new FormControl(null),
    linkedin: new FormControl(null),
    referenceOthersControl: new FormControl(null),
    otherFinancialAssetControl: new FormControl(null)
  });

  constructor(private route: ActivatedRoute, private router: Router,
    private messageService: MessageService,
    private initialInfoService: HttpService, public resources: ResourcesService, ) { }

  async ngOnInit() {
    if (this.route.snapshot.params['token']) {
      this.token = this.route.snapshot.params['token'];
    }

    this.userInfo.incomeSources = this.familyIncome[0].key
    this.userInfo.jobType = this.jobType[0].key
    this.userInfo.numberOfDependents = this.peopleDependOnYou[0].key
    this.userInfo.currency = this.currencyTitleOptions[0].key
    this.userInfo.maritalStatus = MaritalStatus.Single;


    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear((year - 18));

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(1931);
    this.userInfo.ph.isd = "91";

    if (!this.userInfo.dob) {
      this.userInfo.dob = this.minDate;
    }

    try {

      this.messageService.sendMessage('show-loading');
      const response = await this.initialInfoService.request(RequestMethod.Post, "initial-info/is-token-active", { "token": this.token });
      const user = response.user
      this.loadingOnSubmit = false;
      this.pageTitle = `Welcome ${user.name.firstName}! please fill following details.`
      this.userInfo.name = user.name
      if (user.ph) {
        this.userInfo.ph = user.ph
      }
      this.userInfo.email = user.email
      this.messageService.sendMessage('hide-loading');


    } catch (error) {

      this.messageService.sendMessage('hide-loading');

      this.loadingOnSubmit = false;
      this.activatedSuccessFlag = false;
      this.activateFailureFlag = true;
      this.activatedMessage = error.message;
    }

  }

  async submitInitialInfo() {

    let validationSucceded = true;

    if (this.userInfo && !this.userInfo.officialEmail) {
      this.initialInfoForm.controls['officialMailControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['officialMailControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.email) {
      this.initialInfoForm.controls['personalMailControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['personalMailControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.incomeSources) {
      this.initialInfoForm.controls['familyIncomeControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['familyIncomeControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.maritalStatus == undefined) {
      this.initialInfoForm.controls['maritalStatusControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['maritalStatusControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.residentialAddress.addressLine1 == undefined) {
      this.initialInfoForm.controls['residentialAddress1Control'].setErrors({ 'required': true });
      this.initialInfoForm.controls['residentialAddress1Control'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.residentialAddress.city == undefined) {
      this.initialInfoForm.controls['residentialcityControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['residentialcityControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.residentialAddress.pincode == undefined) {
      this.initialInfoForm.controls['residentialpincodeControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['residentialpincodeControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.residentialAddress.country == undefined) {
      this.initialInfoForm.controls['residentialcountryControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['residentialcountryControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.selfOccupiedProperty == undefined) {
      this.initialInfoForm.controls['homeSelfOccupiedControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['homeSelfOccupiedControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.ph.ph) {
      this.initialInfoForm.controls['mobileNumberControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['mobileNumberControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.jobDescription) {
      this.initialInfoForm.controls['jobDescriptionControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['jobDescriptionControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.currency) {
      this.initialInfoForm.controls['currency'].setErrors({ 'required': true });
      this.initialInfoForm.controls['currency'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && !this.userInfo.approximateNetIncome) {
      this.initialInfoForm.controls['netAnualEarningControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['netAnualEarningControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.reference && (!this.userInfo.reference || this.userInfo.reference.length == 0)) {
      this.initialInfoForm.controls['hearAboutUsControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['hearAboutUsControl'].markAsTouched();
      validationSucceded = false;
    }
    // if (this.referenceOthers && this.userInfo && !this.userInfo.reference.description) {
    //   this.initialInfoForm.controls['referenceOthersControl'].setErrors({ 'required': true });
    //   this.initialInfoForm.controls['referenceOthersControl'].markAsTouched();
    //   validationSucceded = false;
    // }

    // if (this.showFinancialAssetOthers && this.userInfo && !this.userInfo.assets.description) {
    //   this.initialInfoForm.controls['otherFinancialAssetControl'].setErrors({ 'required': true });
    //   this.initialInfoForm.controls['otherFinancialAssetControl'].markAsTouched();
    //   validationSucceded = false;
    // }

    if (this.userInfo && this.userInfo.objective && (!this.userInfo.objective || this.userInfo.objective.length == 0)) {
      this.initialInfoForm.controls['objectiveOfUtilisingServiceControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['objectiveOfUtilisingServiceControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userInfo && this.userInfo.assets && (!this.userInfo.assets || this.userInfo.assets.length == 0)) {
      this.initialInfoForm.controls['financialAssetsControl'].setErrors({ 'required': true });
      this.initialInfoForm.controls['financialAssetsControl'].markAsTouched();
      validationSucceded = false;
    }


    if (validationSucceded) {

      this.loadingOnSubmit = true;

      try {

        let userJsonObj = JSON.parse(JSON.stringify(this.userInfo))
        userJsonObj = cleanDeep(userJsonObj)
        const response = await this.initialInfoService.request(RequestMethod.Post, "initial-info", { "token": this.token, "initialInformation": userJsonObj });
        const message = response.message

        this.loadingOnSubmit = false;
        this.activatedSuccessFlag = true;
        this.activateFailureFlag = false;
        this.activatedMessage = message;
        this.initialInfoForm.reset()
        if (this.activatedMessage) {
          this.initialFormShowHide = false;
        }

        window.scrollTo(window.scrollX, 0)

      } catch (error) {

        this.loadingOnSubmit = false;
        this.activatedSuccessFlag = false;
        this.activateFailureFlag = true;
        this.activatedMessage = error.message;

        window.scrollTo(window.scrollX, 0)

      }

    }
  }

  showReferenceOther(event, key) {
    this.referenceOthers = false;
    const test = 'hearAboutUs' + key;
    if (event.target.checked) {
      let id = document.getElementById(test);
      if (key == HearAboutUs.Others || key == HearAboutUs.Friend) {
        id.style.display = 'block';
      }
      this.userInfo.reference.push({ 'referenceType': key, 'description': '' });

    } else {
      let id = document.getElementById(test);
      id.style.display = 'none';
      let index = 0
      for (let referen of this.userInfo.reference) {
        if (key == referen.referenceType) {
          this.userInfo.reference.splice(index, 1);
        }
        index++;
      }
    }
  }

  entryFinancialAssests(event, key) {

    this.showFinancialAssetOthers = false;
    const test = 'financialAsset' + key;
    if (event.target.checked) {
      let id = document.getElementById(test);
      if (key == FinancialAsset.Other) {
        id.style.display = 'block';
      }
      this.userInfo.assets.push({ 'assetType': key, 'description': '' });

    } else {
      let id = document.getElementById(test);
      id.style.display = 'none';

      let index = 0
      for (let asset of this.userInfo.assets) {
        if (key == asset.assetType) {
           this.userInfo.assets.splice(index, 1);
        }
        index++;
      }    
    }
  }

  showMaritalStatus(event, key) {

    if (key == MaritalStatus.Married) {
      this.spouseInfoFormShowHide = true;
    } else {
      this.spouseInfoFormShowHide = false;
    }
  }


  homeSelfOccupied(event) {

    if (event.target.value == "1") {
      this.userInfo.selfOccupiedProperty = true;

    } else {
      this.userInfo.selfOccupiedProperty = false;
    }

  }


  entryObjectiveUtilizingService(event, number) {

    if (event.target.checked) {
      this.userInfo.objective.push(number);
    } else {
      const index = this.userInfo.objective.indexOf(number);
      if (index > -1) {
        this.userInfo.objective.splice(index, 1);
      }
    }
  }

  referenceDescription(value, key) {
    this.userInfo.reference.map((checkKey) => {
      if (checkKey.referenceType == key) {
        checkKey.description = value;
      }
    });
  }

  financialAssetDescription(value, key) {
    this.userInfo.assets.map((checkKey) => {
      if (checkKey.assetType == key) {
        checkKey.description = value;
      }
    });
  }

}

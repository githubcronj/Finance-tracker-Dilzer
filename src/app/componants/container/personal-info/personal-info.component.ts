import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { ResourcesService } from '../../../services/resources.service';
import { KeychainService } from '../../../services/keychain.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../model/client';
import { Name } from '../../../model/value-objects/name';
import { RequestMethod } from '@angular/http';
import { Message } from 'primeng/primeng';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { ValidationService } from '../../../services/validation.service';
import { ClientType, ClientTypeUtils } from '../../../model/enum/client-type.enum';
import { Title, TitleUtils } from '../../../model/enum/title.enum';
import { Gender, GenderUtils } from '../../../model/enum/gender.enum';
import { ResidentialStatus, ResidentialStatusUtils } from '../../../model/enum/residential_status.enum';
import { MaritalStatus, MaritalStatusUtils } from '../../../model/enum/marital-status.enum';
import { PersonalInfoTranslations } from './personal-info.translation';
import { NavbarComponent } from '../navbar/navbar.component';
import { HealthHistoryTranslations } from '../health-details.translations'
import * as cleanDeep from 'clean-deep';
import { GeneralHealthConditonStatus, GeneralHealthConditonUtils } from '../../../model/enum/general-health-condition.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-information',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  informationTranslations = PersonalInfoTranslations;
  hideShowHealthParameters = false
  hideShowChronicDuration = false
  maxDate: Date;
  minDate: Date;
  clientId;
  userDetails = new Client();
  editUserDetails: any;
  clientTypeOptions = ClientTypeUtils.getAllClientType();
  titleOptions = TitleUtils.getAllTitle();
  genderOptions = GenderUtils.getAllGender();
  residentialStatusOptions = ResidentialStatusUtils.getAllResidentialStatus();
  maritalStatusOptions = MaritalStatusUtils.getAllMaritalStatus();
  errorMessage;
  showHideErrorBlock = true;
  loadingOnSubmit = false;
  ageList = [];
  healthHistoryTranslations = HealthHistoryTranslations;
  generalHealthConditionTypes = GeneralHealthConditonUtils.getAllGeneralHealthConditonStatus();
  riskProfileList = []
  isErrorOccured = false
  msgs = [];

  personalInfo = new FormGroup({
    title: new FormControl('Mr', [Validators.required]),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null),
    dilzerStdControl: new FormControl(null),
    dob: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    clientType: new FormControl(null, [Validators.required]),
    maritalStatus: new FormControl(null, [Validators.required]),
    residentialStatus: new FormControl(null, [Validators.required]),
    addressLine1: new FormControl(null, [Validators.required]),
    addressLine2: new FormControl(null),
    locality: new FormControl(null),
    city: new FormControl(null, [Validators.required]),
    pincode: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    landline: new FormControl(null),
    pan: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.panCardPattern)]),
    retirementAge: new FormControl(null),
    riskProfile: new FormControl(null),
    lifeExpectancy: new FormControl(null),
    employer_name: new FormControl(null, [Validators.required]),
    companyAddressLine1: new FormControl(null, [Validators.required]),
    companyAddressLine2: new FormControl(null),
    companyLocality: new FormControl(null),
    companyCity: new FormControl(null, [Validators.required]),
    companyPincode: new FormControl(null, [Validators.required]),
    companyCountry: new FormControl(null, [Validators.required]),
    twitter: new FormControl(null, [Validators.required]),
    googleplus: new FormControl(null, [Validators.required]),
    linkedin: new FormControl(null, [Validators.required]),
    generalHealthCondition: new FormControl(null),
    checkupInterval: new FormControl(null),
    isHeathParamertersNormal: new FormControl(null),
    parametersOutOfRange: new FormControl(null),
    isChronicHeathConditionNormal: new FormControl(null),
    chronicHeathConditionDuration: new FormControl(null),
    isChronicHeathConditionMedicated: new FormControl(null),
    otherHealthCondition: new FormControl(null)
  });

  constructor(
    private keychainService: KeychainService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private changeDetector: ChangeDetectorRef,
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    for (let i = 40; i <= 100; i++) {
      this.ageList.push(i)
    }
 
    this.loadData()

  }

  async loadData() {

    this.clientId = this.route.snapshot.parent.params['clientId'];
    this.navbar.routeBackTitle = 'Information';
    this.navbar.title = 'Personal Information';
    if (this.keychainService.isLoggedInAsAdmin()) {

      this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

    } else {
      this.navbar.routeBackPath = "/auth/home";

    }
    this.navbar.routeBackQueryParams = { selected: 0 };

    this.navbar.isBorderEnabled = true;
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear((year - 18));

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(1931);
    this.editUserDetails = this.userDetails;
    this.editUserDetails.name = new Name();

    try {
      this.messageService.sendMessage('show-loading');
      const settingsResponse = await this.httpService.request(RequestMethod.Get, 'settings/', null);
      this.riskProfileList = settingsResponse.settings.riskProfile

      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.editUserDetails = this.userDetails;


      if (this.editUserDetails.lifeExpectancy == null) {
        this.editUserDetails.lifeExpectancy = 80
      }

      if (this.editUserDetails.retirementAge == null) {
        this.editUserDetails.retirementAge = 60
      }

      if (this.editUserDetails && !this.editUserDetails.title) {
        this.editUserDetails.title = Title.Mr;
      }
      if (this.editUserDetails && !this.editUserDetails.clientType) {
        this.editUserDetails.clientType = ClientType.Individual;
      }
      if (this.editUserDetails && !this.editUserDetails.residentialStatus) {
        this.editUserDetails.residentialStatus = ResidentialStatus.PermanentIndianResident;
      }
      if (this.editUserDetails && !this.editUserDetails.maritalStatus) {
        this.editUserDetails.maritalStatus = MaritalStatus.Single;
      }
      if (this.editUserDetails && !this.editUserDetails.gender) {
        this.editUserDetails.gender = Gender.Male;
      }
      if (this.editUserDetails && !this.editUserDetails.healthHistory.generalHealthCondition) {
        this.editUserDetails.healthHistory.generalHealthCondition = GeneralHealthConditonStatus.VeryGood;
      }
      if (this.editUserDetails && this.editUserDetails.riskProfile && !this.editUserDetails.riskProfile.rate) {
        this.editUserDetails.riskProfile.rate = this.riskProfileList[0].rate
        this.editUserDetails.riskProfile.displayName = this.riskProfileList[0].displayName
      }
      this.isErrorOccured = false
      this.messageService.sendMessage('hide-loading');
    } catch (error) {
      this.showHideErrorBlock = false;
      this.isErrorOccured = true
      this.messageService.sendMessage('hide-loading');
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message
    }
  }

  retry() {
    this.loadData()
  }

  isHeathParamertersNormal(event) {

    if (event.target.value == "1") {
      this.editUserDetails.isHeathParamertersNormal = true;

    } else {
      this.editUserDetails.isHeathParamertersNormal = false;
    }

  }

  didSelectRiskProfile(event) {

    for (let setting of this.riskProfileList) {
      if (setting.displayName == event.target.value) {
        this.editUserDetails.riskProfile.rate = setting.rate
      }
    }

  }

  isChronicHeathConditionMedicated(event) {

    if (event.target.value == "1") {
      this.editUserDetails.isChronicHeathConditionMedicated = true;

    } else {
      this.editUserDetails.isChronicHeathConditionMedicated = false;
    }

  }

  isChronicHeathConditionNormal(event) {

    if (event.target.value == "1") {
      this.editUserDetails.isChronicHeathConditionNormal = true;

    } else {
      this.editUserDetails.isChronicHeathConditionNormal = false;
    }

  }


  async savePersonalInformation() {
    let validationSucceded = true;


    if (this.editUserDetails && this.editUserDetails.title == null) {
      this.personalInfo.controls['title'].setErrors({ 'required': true });
      this.personalInfo.controls['title'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.name && !this.editUserDetails.name.firstName) {
      this.personalInfo.controls['firstName'].setErrors({ 'required': true });
      this.personalInfo.controls['firstName'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.dob) {
      this.personalInfo.controls['dob'].setErrors({ 'required': true });
      this.personalInfo.controls['dob'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.gender == null) {
      this.personalInfo.controls['gender'].setErrors({ 'required': true });
      this.personalInfo.controls['gender'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.clientType == null) {
      this.personalInfo.controls['clientType'].setErrors({ 'required': true });
      this.personalInfo.controls['clientType'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.maritalStatus == null) {
      this.personalInfo.controls['maritalStatus'].setErrors({ 'required': true });
      this.personalInfo.controls['maritalStatus'].markAsTouched();
      validationSucceded = false;
    }

    if (this.editUserDetails && this.editUserDetails.residentialStatus == null) {
      this.personalInfo.controls['residentialStatus'].setErrors({ 'required': true });
      this.personalInfo.controls['residentialStatus'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.residentialAddress.addressLine1) {
      this.personalInfo.controls['addressLine1'].setErrors({ 'required': true });
      this.personalInfo.controls['addressLine1'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.residentialAddress.city) {
      this.personalInfo.controls['city'].setErrors({ 'required': true });
      this.personalInfo.controls['city'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.residentialAddress.pincode) {
      this.personalInfo.controls['pincode'].setErrors({ 'required': true });
      this.personalInfo.controls['pincode'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.residentialAddress.country) {
      this.personalInfo.controls['country'].setErrors({ 'required': true });
      this.personalInfo.controls['country'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.pan) {
      this.personalInfo.controls['pan'].setErrors({ 'required': true });
      this.personalInfo.controls['pan'].markAsTouched();
      validationSucceded = false;
    }
    const panCardPattern = this.validationService.panCardPattern;
    if (this.editUserDetails.pan && !panCardPattern.test(this.editUserDetails.pan)) {
      this.personalInfo.controls['pan'].setErrors({ 'pattern': true });
      this.personalInfo.controls['pan'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.companyAddress.addressLine1) {
      this.personalInfo.controls['companyAddressLine1'].setErrors({ 'required': true });
      this.personalInfo.controls['companyAddressLine1'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.companyAddress.city) {
      this.personalInfo.controls['companyCity'].setErrors({ 'required': true });
      this.personalInfo.controls['companyCity'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.companyAddress.pincode) {
      this.personalInfo.controls['companyPincode'].setErrors({ 'required': true });
      this.personalInfo.controls['companyPincode'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.companyAddress.country) {
      this.personalInfo.controls['companyCountry'].setErrors({ 'required': true });
      this.personalInfo.controls['companyCountry'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.healthHistory.isHeathParamertersNormal == false && this.editUserDetails.healthHistory.parametersOutOfRange == null) {
      this.personalInfo.controls['parametersOutOfRange'].setErrors({ 'required': true });
      this.personalInfo.controls['parametersOutOfRange'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.healthHistory.isChronicHeathConditionNormal == true && this.editUserDetails.healthHistory.chronicHeathConditionDuration == null) {
      this.personalInfo.controls['chronicHeathConditionDuration'].setErrors({ 'required': true });
      this.personalInfo.controls['chronicHeathConditionDuration'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.riskProfile.rate) {
      this.personalInfo.controls['riskProfile'].setErrors({ 'required': true });
      this.personalInfo.controls['riskProfile'].markAsTouched();
      validationSucceded = false;
    } else {

      for (let profile of this.riskProfileList) {
        if (profile["rate"] == this.editUserDetails.riskProfile.rate) {
          this.editUserDetails.riskProfile = profile
          break;
        }
      }
    }



    if (validationSucceded) {

      this.loadingOnSubmit = true;
      try {

        let userJsonObj = JSON.parse(JSON.stringify(this.editUserDetails))
        userJsonObj = cleanDeep(userJsonObj);
        const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId, userJsonObj);
        this.navbar.routeBack()
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

  showHideParametersSection() {
    if (this.editUserDetails.healthHistory.isHeathParamertersNormal == true) {
      this.hideShowHealthParameters = false
    } else {
      this.hideShowHealthParameters = true
    }
  }

  showHideChronicDurationSection() {
    if (this.editUserDetails.healthHistory.isChronicHeathConditionNormal == true) {
      this.hideShowChronicDuration = true
    } else {
      this.hideShowChronicDuration = false
    }
  }

  routeBack() {
    this.navbar.routeBack()
  }
}

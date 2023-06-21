import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { KeychainService } from '../../../services/keychain.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../model/client';
import { Name } from '../../../model/value-objects/name';
import { RequestMethod } from '@angular/http';
import { Message } from 'primeng/primeng';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { ValidationService } from '../../../services/validation.service';
import { CountryCodeService } from '../../../services/countryCode.service';
import { ResourcesService } from '../../../services/resources.service';
import { Title, TitleUtils } from '../../../model/enum/title.enum';
import { Gender, GenderUtils } from '../../../model/enum/gender.enum';
import { ResidentialStatus, ResidentialStatusUtils } from '../../../model/enum/residential_status.enum';
import { SpouseInfoTranslations } from './spouse-info.translation';
import { NavbarComponent } from '../navbar/navbar.component';
import * as cleanDeep from 'clean-deep';
import { Spouse } from '../../../model/spouse';
import { PhoneNumber } from '../../../model/value-objects/phoneNumber';
import { HealthHistoryTranslations } from '../health-details.translations'
import { GeneralHealthConditonStatus, GeneralHealthConditonUtils } from '../../../model/enum/general-health-condition.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-information',
  templateUrl: './spouse-info.component.html',
  providers: [CountryCodeService],
  styleUrls: ['./spouse-info.component.css']
})
export class SpouseInfoComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  informationTranslations = SpouseInfoTranslations;
  hideShowHealthParameters = false
  hideShowChronicDuration = false
  maxDate: Date;
  minDate: Date;
  clientId;
  userDetails = new Client();
  editUserDetails: any;
  titleOptions = TitleUtils.getAllTitle();
  genderOptions = GenderUtils.getAllGender();
  residentialStatusOptions = ResidentialStatusUtils.getAllResidentialStatus();
  countriesCode;
  loadingOnSubmit = false;
  ageList = [];
  healthHistoryTranslations = HealthHistoryTranslations;
  generalHealthConditionTypes = GeneralHealthConditonUtils.getAllGeneralHealthConditonStatus();
  isErrorOccured = false
  msgs = [];
  
  spouseInfo = new FormGroup({
    title: new FormControl('Mr', [Validators.required]),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null),
    dilzerIsdControl: new FormControl(null),
    dob: new FormControl(null),
    gender: new FormControl(null, [Validators.required]),
    residentialStatus: new FormControl(null, [Validators.required]),
    mobile_number: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.mobilePattern)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
    pan: new FormControl(null, [Validators.pattern(this.validationService.panCardPattern)]),
    employerName: new FormControl(null),
    companyAddressLine1: new FormControl(null, [Validators.required]),
    companyAddressLine2: new FormControl(null),
    companyLocality: new FormControl(null),
    companyCity: new FormControl(null, [Validators.required]),
    companyPincode: new FormControl(null, [Validators.required]),
    companyCountry: new FormControl(null, [Validators.required]),
    retirementAge: new FormControl(null),
    lifeExpectancy: new FormControl(null),
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
    private countryCodeService: CountryCodeService,
    public resources: ResourcesService,
    private changeDetector: ChangeDetectorRef,
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
    this.countriesCode = CountryCodeService.codes();
    this.navbar.routeBackTitle = 'Information';
    this.navbar.title = 'Spouse Information';
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
    this.editUserDetails.spouse = new Spouse();
    this.editUserDetails.spouse.name = new Name();
    this.editUserDetails.spouse.ph = new PhoneNumber();

    try {
      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.editUserDetails = this.userDetails;
      if (!this.editUserDetails.spouse.dob) {
        this.editUserDetails.spouse.dob = this.minDate;
      }

      if (!this.editUserDetails.spouse.residentialStatus) {
        this.editUserDetails.spouse.residentialStatus = ResidentialStatus.PermanentIndianResident
      }
      if (!this.editUserDetails.spouse.title) {
        this.editUserDetails.spouse.title = Title.Ms
      }

      if (!this.editUserDetails.spouse.ph.isd) {
        this.editUserDetails.spouse.ph.isd = '91'
      }
      if (!this.editUserDetails.spouse.gender) {
        this.editUserDetails.spouse.gender = Gender.Female
      }
      if (this.editUserDetails.spouse.lifeExpectancy == null) {
        this.editUserDetails.spouse.lifeExpectancy = 80
      }
      if (this.editUserDetails.spouse.retirementAge == null) {
        this.editUserDetails.spouse.retirementAge = 60
      }
      if (this.editUserDetails && !this.editUserDetails.spouse.healthHistory.generalHealthCondition) {
        this.editUserDetails.spouse.healthHistory.generalHealthCondition = GeneralHealthConditonStatus.VeryGood;
      }
      this.messageService.sendMessage('hide-loading');
      this.isErrorOccured = false
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

  isHeathParamertersNormal(event) {

    if (event.target.value == "1") {
      this.editUserDetails.spouse.healthHistory.isHeathParamertersNormal = true;

    } else {
      this.editUserDetails.spouse.healthHistoryisHeathParamertersNormal = false;
    }

  }

  isChronicHeathConditionMedicated(event) {

    if (event.target.value == "1") {
      this.editUserDetails.spouse.healthHistory.isChronicHeathConditionMedicated = true;

    } else {
      this.editUserDetails.spouse.healthHistory.isChronicHeathConditionMedicated = false;
    }

  }

  isChronicHeathConditionNormal(event) {

    if (event.target.value == "1") {
      this.editUserDetails.spouse.healthHistory.isChronicHeathConditionNormal = true;

    } else {
      this.editUserDetails.spouse.healthHistory.isChronicHeathConditionNormal = false;
    }

  }

  async saveSpouseInformation() {
    let validationSucceded = true;

    if (this.editUserDetails && this.editUserDetails.spouse.title == null) {
      this.spouseInfo.controls['title'].setErrors({ 'required': true });
      this.spouseInfo.controls['title'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.spouse.name.firstName) {
      this.spouseInfo.controls['firstName'].setErrors({ 'required': true });
      this.spouseInfo.controls['firstName'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.spouse.dob) {
      this.spouseInfo.controls['dob'].setErrors({ 'required': true });
      this.spouseInfo.controls['dob'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.spouse.gender == null) {
      this.spouseInfo.controls['gender'].setErrors({ 'required': true });
      this.spouseInfo.controls['gender'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.spouse.residentialStatus == null) {
      this.spouseInfo.controls['residentialStatus'].setErrors({ 'required': true });
      this.spouseInfo.controls['residentialStatus'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && !this.editUserDetails.spouse.ph.ph) {
      this.spouseInfo.controls['mobile_number'].setErrors({ 'required': true });
      this.spouseInfo.controls['mobile_number'].markAsTouched();
      validationSucceded = false;
    }
    const phonePattern = this.validationService.mobilePattern;
    if (this.editUserDetails && !phonePattern.test(this.editUserDetails.spouse.ph.ph)) {
      this.spouseInfo.controls['mobile_number'].setErrors({ 'pattern': true });
      this.spouseInfo.controls['mobile_number'].markAsTouched();
      validationSucceded = false;
    }

    if (this.editUserDetails && !this.editUserDetails.spouse.email) {
      this.spouseInfo.controls['email'].setErrors({ 'required': true });
      this.spouseInfo.controls['email'].markAsTouched();
      validationSucceded = false;
    }

    const emailPattern = this.validationService.emailPattern;
    if (this.editUserDetails && !emailPattern.test(this.editUserDetails.spouse.email)) {
      this.spouseInfo.controls['email'].setErrors({ 'pattern': true });
      this.spouseInfo.controls['email'].markAsTouched();
      validationSucceded = false;
    }

    if (this.editUserDetails && !this.editUserDetails.spouse.pan) {
      this.spouseInfo.controls['pan'].setErrors({ 'required': true });
      this.spouseInfo.controls['pan'].markAsTouched();
      validationSucceded = false;
    }

    const panCardPattern = this.validationService.panCardPattern;
    if (this.editUserDetails && !panCardPattern.test(this.editUserDetails.spouse.pan)) {
      this.spouseInfo.controls['pan'].setErrors({ 'pattern': true });
      this.spouseInfo.controls['pan'].markAsTouched();
      validationSucceded = false;
    }

    if (this.editUserDetails && this.editUserDetails.spouse && this.editUserDetails.spouse.healthHistory.isHeathParamertersNormal == false && this.editUserDetails.spouse.healthHistory.parametersOutOfRange == null) {
      this.spouseInfo.controls['parametersOutOfRange'].setErrors({ 'required': true });
      this.spouseInfo.controls['parametersOutOfRange'].markAsTouched();
      validationSucceded = false;
    }
    if (this.editUserDetails && this.editUserDetails.spouse && this.editUserDetails.spouse.healthHistory.isChronicHeathConditionNormal == true && this.editUserDetails.spouse.healthHistory.chronicHeathConditionDuration == null) {

      this.spouseInfo.controls['chronicHeathConditionDuration'].setErrors({ 'required': true });
      this.spouseInfo.controls['chronicHeathConditionDuration'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {
      this.loadingOnSubmit = true;
      try {
        let userJsonObj = JSON.parse(JSON.stringify(this.editUserDetails))
        userJsonObj = cleanDeep(userJsonObj);
        const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/spouse', userJsonObj.spouse);
        this.navbar.routeBack()
        // this.editUserDetails = this.userDetails;
        // const user = response.user
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

  async deleteSpouseInformation() {
    if (confirm('Are you sure you want to remove your spouse information?') == true) {
      try {
        const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/spouse', null);
        this.navbar.routeBack()
      } catch (error) {
        // this.loadingOnSubmit = false;
        if (error.message) {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        } else {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
        }
      }
    }
  }

  showHideParametersSection() {
    if (this.editUserDetails.spouse.healthHistory.isHeathParamertersNormal == true) {
      this.hideShowHealthParameters = false
    } else {
      this.hideShowHealthParameters = true
    }
  }

  showHideChronicDurationSection() {
    if (this.editUserDetails.spouse.healthHistory.isChronicHeathConditionNormal == true) {
      this.hideShowChronicDuration = true
    } else {
      this.hideShowChronicDuration = false
    }
  }


  routeBack() {
    this.navbar.routeBack()
  }
}

import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpService } from '../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { RateOptionsType, RateOptionsTypeUtils } from '../../../model/enum/rate-options.enum'
import { RateOfReturn } from '../../../model/rateOfReturn';
import { Goal } from '../../../model/goal/goal';
import { Client } from '../../../model/client';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { DatePickerType } from '../date-picker/date-picker.enum'
import { MessageService } from '../../../services/message.service';
import { AssetTypeUtils } from '../../../model/enum/asset/asset-type.enum'


@Component({
  selector: 'app-goal-corpus-rate-of-return',
  templateUrl: './goal-corpus-rate-of-return.component.html',
  styleUrls: ['./goal-corpus-rate-of-return.component.css']
})
export class GoalCorpusRateOfReturnComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  clientId: any;
  goalId: any;
  goalCorpusRateOfReturnId: any
  rateOfReturn = new RateOfReturn();
  goal: Goal;
  userDetails
  assetClassSetting: any
  endDate
  riskProfileSettingData: any;

  loadingOnSubmit = false;
  showRiskProfileSetting = false
  msgs = []
  minDate = new Date();
  minimumEndDate: Date;
  isErrorOccured = false
  showAssetClassSetting = false
  blockHeader = 'Add Goal Corpus Rate of Return';
  buttonText = 'Add'
  showFromDate = false
  assetTypeUtils = AssetTypeUtils


  rateOfReturnTypes = RateOptionsTypeUtils.getAllRateOfReturnType();

  rateOfReturnForm = new FormGroup({
    fromDateControl: new FormControl(null),
    typeControl: new FormControl(null, [Validators.required]),
    rateControl: new FormControl(null),
    riskProfileRateControl: new FormControl(null, [Validators.required]),
    assetClassRateControl: new FormControl(null, [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadData()

  }

  async loadData() {

    try {
      this.clientId = this.route.snapshot.params['clientId'];
      this.goalId = this.route.snapshot.params['goalId'];
      this.goalCorpusRateOfReturnId = this.route.snapshot.params['goalCorpusRateOfReturnId'];
      this.navbar.routeBackTitle = 'Goal Information';
      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Goal Corpus Rate Of Return';
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/goal/${this.goalId}`;

      this.messageService.sendMessage('show-loading');
      const parser = new JsonConvert()
      const settingsResponse = await this.httpService.request(RequestMethod.Get, 'settings/', null);
      this.riskProfileSettingData = settingsResponse.settings.riskProfile
      this.assetClassSetting = settingsResponse.settings.assetClassSetting

      let clientDetail = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      this.userDetails = parser.deserialize(clientDetail.client, Client);

      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/goal/' + this.goalId, null);
      this.goal = parser.deserialize(response.goal, Goal);
      this.navbar.subTitle = this.goal.name + ' of ' + this.userDetails.name.fullName();

      if (this.goalCorpusRateOfReturnId) {
        await this.getRateOfReturnDetails();
      } else {

        if (this.rateOfReturn.rateOfReturnType == null) {
          this.rateOfReturn.rateOfReturnType = RateOptionsType.SetByClientRiskProfile
          this.rateOfReturn.rate = this.userDetails.riskProfile.rate
        }
        this.setDate()

        if (this.goal.rateOfReturns.length > 0) {
          const lastRateOfReturn = this.goal.rateOfReturns[this.goal.rateOfReturns.length - 1]
          this.rateOfReturn.fromDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)
          this.minimumEndDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)
          this.showFromDate = true

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

  setDate() {


    if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.startDate && (this.goal.goalTimeLine.startDate.type == DatePickerType.ByDate)) {

      this.rateOfReturn.fromDate = this.goal.goalTimeLine.startDate.date

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.startDate && (this.goal.goalTimeLine.startDate.type == DatePickerType.ByAge)) {

      let member = this.userDetails.memberInfo(this.goal.goalTimeLine.startDate.ageMember)
      let startDate = new Date(member.dob);
      startDate.setFullYear(startDate.getFullYear() + Number(this.goal.goalTimeLine.startDate.age));
      this.rateOfReturn.fromDate = startDate

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.startDate && (this.goal.goalTimeLine.startDate.type == DatePickerType.ByRetirementAge)) {

      let startDate = new Date(this.userDetails.dob);
      startDate.setFullYear(startDate.getFullYear() + this.userDetails.retirementAge + Number(this.goal.goalTimeLine.startDate.retirementIndex));
      this.rateOfReturn.fromDate = startDate

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.startDate && (this.goal.goalTimeLine.startDate.type == DatePickerType.ByLifeExpectency)) {

      let startDate = new Date(this.userDetails.dob);
      startDate.setFullYear(startDate.getFullYear() + this.userDetails.lifeExpectancy + Number(this.goal.goalTimeLine.startDate.expiryIndex));
      this.rateOfReturn.fromDate = startDate

    }

    if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.endDate && (this.goal.goalTimeLine.endDate.type == DatePickerType.ByDate)) {

      this.endDate = this.goal.goalTimeLine.endDate.date

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.endDate && (this.goal.goalTimeLine.endDate.type == DatePickerType.ByAge)) {

      let member = this.userDetails.memberInfo(this.goal.goalTimeLine.endDate.ageMember)
      this.endDate = new Date(member.dob);
      this.endDate.setFullYear(this.endDate.getFullYear() + Number(this.goal.goalTimeLine.endDate.age));

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.endDate && (this.goal.goalTimeLine.endDate.type == DatePickerType.ByRetirementAge)) {

      this.endDate = new Date(this.userDetails.dob);
      this.endDate.setFullYear(this.endDate.getFullYear() + this.userDetails.retirementAge + Number(this.goal.goalTimeLine.endDate.retirementIndex));

    } else if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.endDate && (this.goal.goalTimeLine.endDate.type == DatePickerType.ByLifeExpectency)) {

      this.endDate = new Date(this.userDetails.dob);
      this.endDate.setFullYear(this.endDate.getFullYear() + this.userDetails.lifeExpectancy + Number(this.goal.goalTimeLine.endDate.expiryIndex));

    } else {
      this.endDate = new Date(this.userDetails.dob);
      this.endDate.setFullYear(this.endDate.getFullYear() + this.userDetails.lifeExpectancy);
    }
  }

  didSelectRateOfReturnType(event) {

    if (event.target.value == RateOptionsType.SetByClientRiskProfile) {

      this.showRiskProfileSetting = false
      this.showAssetClassSetting = false
      this.rateOfReturn.rate = this.userDetails.riskProfile.rate
      this.rateOfReturn.displayString = 'Client expected rate of return '

    } else if (event.target.value == RateOptionsType.SetManually) {

      this.showRiskProfileSetting = false
      this.showAssetClassSetting = false
      this.rateOfReturn.rate = 0
      this.rateOfReturn.displayString = undefined

    } else if (event.target.value == RateOptionsType.SetByRiskProfile) {

      this.showAssetClassSetting = false
      this.showRiskProfileSetting = true
      this.rateOfReturn.rate = this.riskProfileSettingData[0].rate
      this.rateOfReturn.displayString = this.riskProfileSettingData[0].displayName

    } else if (event.target.value == RateOptionsType.SetByAssetClass) {

      this.showRiskProfileSetting = false
      this.showAssetClassSetting = true
      this.rateOfReturn.rate = this.assetClassSetting[0].rate
      this.rateOfReturn.displayString = this.assetClassSetting[0].assetSubType
      this.rateOfReturn.assetType = this.assetClassSetting[0].assetType

    }
  }
  didSelectRiskProfileType(event) {

    for (let setting of this.riskProfileSettingData) {
      if (setting.displayName == event.target.value) {
        this.rateOfReturn.rate = setting.rate
      }
    }
  }

  didSelectAssetClassType(event) {

    for (let setting of this.assetClassSetting) {
      if (setting.assetSubType == event.target.value) {
        this.rateOfReturn.rate = setting.rate
        this.rateOfReturn.assetType = setting.assetType;
        if (setting.rate == null) {
          this.rateOfReturn.rate = this.userDetails.riskProfile.rate
        }
      }
    }
  }

  async getRateOfReturnDetails() {

    try {

      this.rateOfReturn = this.goal.rateOfReturns.find(rateOfReturn => rateOfReturn._id == this.goalCorpusRateOfReturnId)
      if (this.rateOfReturn.rateOfReturnType == RateOptionsType.SetByAssetClass) {
        this.showAssetClassSetting = true
      } else if (this.rateOfReturn.rateOfReturnType == RateOptionsType.SetByRiskProfile) {
        this.showRiskProfileSetting = true
      }
      this.buttonText = 'Update'

    } catch (error) {
      throw error
    }
  }

  async didClickAddRateOfReturns() {

    let validationSucceded = true;

    if (this.rateOfReturn && !this.rateOfReturn.fromDate) {
      this.rateOfReturnForm.controls['fromDateControl'].setErrors({ 'required': true });
      this.rateOfReturnForm.controls['fromDateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.goalCorpusRateOfReturnId && this.rateOfReturn && this.rateOfReturn.rate == null) {
      this.rateOfReturnForm.controls['rateControl'].setErrors({ 'required': true });
      this.rateOfReturnForm.controls['rateControl'].markAsTouched();
      validationSucceded = false;
    }


    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.rateOfReturn.rateOfReturnType == RateOptionsType.SetByClientRiskProfile) {

        this.rateOfReturn.displayString = 'Client expected rate of return '

      }

      if (this.goalCorpusRateOfReturnId) {


        url = 'client/' + this.clientId + '/goal/' + this.goalId + '/rateOfReturn/' + this.goalCorpusRateOfReturnId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/goal/' + this.goalId + '/rateOfReturn';
        method = RequestMethod.Post;
      }
      try {
        const response = await this.httpService.request(method, url, this.rateOfReturn);
        this.loadingOnSubmit = false;
        this.didClickCancelButton();

      } catch (error) {
        this.loadingOnSubmit = false;
        if (error.message) {
          this.msgs = []
          this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        } else {
          this.msgs = []
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
        }

      }
    }
  }

  setRateOfReturnFromDate(date) {

    let today = new Date(date);
    var datatodays = today.setDate(new Date(today).getDate() + 1);
    let nextFromDate = new Date(datatodays);
    return nextFromDate

  }


  didClickCancelButton() {
    this.navbar.routeBack()
  }

}




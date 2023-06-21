import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpService } from '../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { RateOptionsType, RateOptionsTypeUtils } from '../../../model/enum/rate-options.enum'
import { RealEstateAssetSubType } from '../../../model/enum/asset/real-estate-sub-type.enum'
import { RateOfReturn } from '../../../model/rateOfReturn';
import { Asset } from '../../../model/asset/asset';
import { Insurance } from '../../../model/asset/insurance';
import { Client } from '../../../model/client';
import { AssetType } from '../../../model/enum/asset/asset-type.enum'
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';
import { AssetTypeUtils } from '../../../model/enum/asset/asset-type.enum';


@Component({
  selector: 'app-rate-of-return',
  templateUrl: './rate-of-return.component.html',
  styleUrls: ['./rate-of-return.component.css']
})
export class RateOfReturnComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  clientId: any;
  assetId: any;
  rateOfReturnId: any
  rateOfReturn = new RateOfReturn();
  asset: Asset;
  userDetails
  assetClassSetting = []
  blockHeader = 'Add Rate of Return';
  buttonText = 'Add'
  riskProfileSettingData: any;
  assetTypeUtils = AssetTypeUtils

  loadingOnSubmit = false;
  showRiskProfileSetting = false
  msgs = []
  minDate
  minimumEndDate: Date;
  isErrorOccured = false
  showAssetClassSetting = false


  rateOfReturnTypes = RateOptionsTypeUtils.getAllRateOfReturnType();

  rateOfReturnForm = new FormGroup({
    fromDateControl: new FormControl({ value: null, disabled: false }),
    toDateControl: new FormControl(null),
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
      this.assetId = this.route.snapshot.params['assetId'];
      this.rateOfReturnId = this.route.snapshot.params['rateOfReturnId'];
      this.navbar.routeBackTitle = 'Asset Information';
      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Rate Of Return';
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;

      this.messageService.sendMessage('show-loading');
      const parser = new JsonConvert()
      const settingsResponse = await this.httpService.request(RequestMethod.Get, 'settings/', null);
      this.riskProfileSettingData = settingsResponse.settings.riskProfile
      let assetSetting = settingsResponse.settings.assetClassSetting


      let clientDetail = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      this.userDetails = parser.deserialize(clientDetail.client, Client);

      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
      this.asset = parser.deserialize(response.asset, Asset);
      this.navbar.subTitle = this.asset.name + ' of ' + this.userDetails.name.fullName();

      for (let setting of assetSetting) {
        if (setting.assetType == this.asset.kind) {
          this.assetClassSetting.push(setting)
        }
      }

      if (this.rateOfReturnId) {
        this.blockHeader = "Edit Rate of Return";
        await this.getRateOfReturnDetails();
        this.changeDetector.detectChanges()
      } else {

        if (this.rateOfReturn.rateOfReturnType == null) {
          this.rateOfReturn.rateOfReturnType = RateOptionsType.SetByClientRiskProfile
          this.rateOfReturn.rate = this.userDetails.riskProfile.rate

        }

        if (this.asset instanceof Insurance) {

          if (this.asset.rateOfReturns.length > 0) {
            const lastRateOfReturn = this.asset.rateOfReturns[this.asset.rateOfReturns.length - 1]
            this.rateOfReturn.fromDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)
            this.minimumEndDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)/*lastRateOfReturn.toDate*/

          } else {
            this.rateOfReturn.fromDate = new Date()
            // this.rateOfReturn.toDate = this.asset.maturityDate
            this.minDate = this.asset.premiumStartDate
          }
        } else {
          this.minDate = new Date()
          if (this.asset.rateOfReturns.length > 0) {
            const lastRateOfReturn = this.asset.rateOfReturns[this.asset.rateOfReturns.length - 1]
            this.rateOfReturn.fromDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)
            this.minimumEndDate = this.setRateOfReturnFromDate(lastRateOfReturn.fromDate)
          }
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
        this.rateOfReturn.rate = setting.rate;
        this.rateOfReturn.assetType = setting.assetType;
        if (setting.rate == null) {
          this.rateOfReturn.rate = this.userDetails.riskProfile.rate
        }
      }
    }

  }

  async getRateOfReturnDetails() {

    try {

      this.rateOfReturn = this.asset.rateOfReturns.find(rateOfReturn => rateOfReturn._id == this.rateOfReturnId)
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
    if (this.rateOfReturnId && this.rateOfReturn && this.rateOfReturn.rate == null) {
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

      if (this.rateOfReturnId) {

        url = 'client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn/' + this.rateOfReturnId;
        method = RequestMethod.Put;
      } else {

        url = 'client/' + this.clientId + '/asset/' + this.assetId + '/rateOfReturn';
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

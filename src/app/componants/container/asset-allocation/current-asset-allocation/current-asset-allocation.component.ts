import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpService } from '../../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../../model/parsers/json-convert';
import { AssetAllocation } from '../../../../model/asset/assetAllocation/assetAllocation';
import { Asset } from '../../../../model/asset/asset';
import { Client } from '../../../../model/client';
import { RateOptionsType, RateOptionsTypeUtils } from '../../../../model/enum/rate-options.enum'
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component'
import { MessageService } from '../../../../services/message.service';
import { AssetTypeUtils } from '../../../../model/enum/asset/asset-type.enum';

@Component({
  selector: 'app-current-asset-allocation',
  templateUrl: './current-asset-allocation.component.html',
  styleUrls: ['./current-asset-allocation.component.css']
})
export class CurrentAssetAllocationComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  msgs = [];
  clientId;
  assetId;
  asset: Asset
  loadingOnSubmit = false;
  assetTypeUtils = AssetTypeUtils;

  assetClassSettings = []
  userDetails: any

  showAssetClassSetting = false
  assetAllocation = new AssetAllocation();
  isErrorOccured = false

  assetAllocationTypes = RateOptionsTypeUtils.getAllCurrentAssetAllocationType();
  rateOptions = RateOptionsType

  assetAllocationForm = new FormGroup({
    assetAllocationTypeControl: new FormControl(null, [Validators.required]),
    assetClassRateControl: new FormControl(null),
    rateControl: new FormControl(null)
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
      this.navbar.routeBackTitle = 'Asset Information';
      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Current Asset Allocation';
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;

      this.messageService.sendMessage('show-loading');
      const parser = new JsonConvert()
      const response = await this.httpService.request(RequestMethod.Get, 'settings/', null);
      let assetSetting = response.settings.assetClassSetting


      const clientDetail = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      this.userDetails = parser.deserialize(clientDetail.client, Client);

      await this.getAssetAllocationDetails();

      for (let setting of assetSetting) {
        if (setting.assetType == this.asset.kind) {
          this.assetClassSettings.push(setting)
        }
      }

      if (this.assetAllocation.allocationType == null) {
        this.assetAllocation.allocationType = RateOptionsType.DoNotInclude
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

  didSelectAssetAllocationType(event) {


    if (event.target.value == RateOptionsType.SetByAssetClass) {
      this.showAssetClassSetting = true
      this.assetAllocation.doNotInclude = false

      this.assetAllocation.rate = this.assetClassSettings[0].rate
      this.assetAllocation.displayString = this.assetClassSettings[0].assetSubType

    } else {

      this.showAssetClassSetting = false
      this.assetAllocation.doNotInclude = true
    }
  }

  didSelectAssetClassType(event) {
    for (let setting of this.assetClassSettings) {
      if (setting.assetSubType == event.target.value) {
        this.assetAllocation.rate = setting.rate

        if (setting.rate == null) {
          this.assetAllocation.rate = this.userDetails.riskProfile.rate
        }
      }
    }

  }

  async getAssetAllocationDetails() {

    try {

      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
      const parser = new JsonConvert()
      this.asset = parser.deserialize(response.asset, Asset);
      this.navbar.subTitle = this.asset.name + ' of ' + this.userDetails.name.fullName();
      if (this.asset.currentAssetAllocation) {
        this.assetAllocation = this.asset.currentAssetAllocation
      }
      if (this.assetAllocation.allocationType == RateOptionsType.SetByAssetClass) {
        this.showAssetClassSetting = true
      }
    }
    catch (error) {
      throw error
    }
  }

  async didClickAddCurrentAssetAlllocation() {

    this.loadingOnSubmit = true;

    if (this.assetAllocation.doNotInclude) {
      this.assetAllocation.rate = undefined
    }

    try {
      const response = await this.httpService.request(RequestMethod.Post, 'client/' + this.clientId + '/asset/' + this.assetId + '/currentAllocation', this.assetAllocation);
      this.loadingOnSubmit = false;

      this.didClickCancelButton();

    } catch (error) {

      this.loadingOnSubmit = false;
      if (error.message) {
        this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
      } else {
        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
      }

    }

  }

  didClickCancelButton() {
    this.navbar.routeBack()
  }

  async ngAfterViewInit() {
  }
}

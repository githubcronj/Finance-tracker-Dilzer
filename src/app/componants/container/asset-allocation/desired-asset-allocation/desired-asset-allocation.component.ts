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

@Component({
  selector: 'app-desired-asset-allocation',
  templateUrl: './desired-asset-allocation.component.html',
  styleUrls: ['./desired-asset-allocation.component.css']
})
export class DesiredAssetAllocationComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  msgs = [];
  clientId;
  assetId;
  loadingOnSubmit = false;

  riskProfileSettings: any;
  userDetails: any

  showRiskProfileSetting = false
  assetAllocation = new AssetAllocation();
  isErrorOccured = false

  assetAllocationTypes = RateOptionsTypeUtils.getAllDesiredAssetAllocationType();
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
    this.clientId = this.route.snapshot.params['clientId'];
    this.assetId = this.route.snapshot.params['assetId'];
    this.navbar.routeBackTitle = 'Asset Information';
    this.navbar.isBorderEnabled = true;
    this.navbar.title = 'Desired Asset Allocation';
    this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;


    try {
      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'settings/', null);
      const parser = new JsonConvert()
      this.riskProfileSettings = response.settings.riskProfile

      const clientDetail = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      this.userDetails = parser.deserialize(clientDetail.client, Client);

      await this.getAssetAllocationDetails();
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

  didSelectRiskProfileType(event) {

    for (let setting of this.riskProfileSettings) {
      if (setting.name == event.target.value) {
        this.assetAllocation.rate = setting.rate
      }
    }
  }

  didSelectAssetAllocationType(event) {

    if (event.target.value == RateOptionsType.SetByRiskProfile) {
      this.showRiskProfileSetting = true
      this.assetAllocation.doNotInclude = false

      this.assetAllocation.rate = this.riskProfileSettings[0].rate
      this.assetAllocation.displayString = this.riskProfileSettings[0].displayName

    } else if (event.target.value == RateOptionsType.SetByClientRiskProfile) {
      this.showRiskProfileSetting = false
      this.assetAllocation.doNotInclude = false

      this.assetAllocation.rate = this.userDetails.riskProfile.rate
      this.assetAllocation.displayString = 'Client expected rate of return '

    } else {

      this.showRiskProfileSetting = false
      this.assetAllocation.doNotInclude = true
    }
  }

  async getAssetAllocationDetails() {

    try {

      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
      const parser = new JsonConvert()
      let asset: Asset = parser.deserialize(response.asset, Asset);

      this.navbar.subTitle = asset.name + ' of ' + this.userDetails.name.fullName();

      if (asset.desiredAssetAllocation) {
        this.assetAllocation = asset.desiredAssetAllocation
      }
      if (this.assetAllocation.allocationType == RateOptionsType.SetByRiskProfile) {
        this.showRiskProfileSetting = true
      }
    }
    catch (error) {
      throw error
    }
  }

  async didClickAddDesiredAssetAlllocation() {

    this.loadingOnSubmit = true;

    if (this.assetAllocation.doNotInclude) {
      this.assetAllocation.rate = undefined
    }

    try {
      const response = await this.httpService.request(RequestMethod.Post, 'client/' + this.clientId + '/asset/' + this.assetId + '/desiredAssetAllocation', this.assetAllocation);
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

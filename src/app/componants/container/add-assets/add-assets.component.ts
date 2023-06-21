import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Admin } from '../../../model/admin';
import { Client } from '../../../model/client';
import { Asset } from '../../../model/asset/asset'
import { TeamMemberRole, TeamMemberRoleUtils } from '../../../model/enum/team-member-role.enum'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { AssetType, AssetTypeUtils } from '../../../model/enum/asset/asset-type.enum';
import { BondAssetSubType, BondAssetSubTypeUtils } from '../../../model/enum/asset/bond-sub-type.enum';
import { CashInHandAssetSubType, CashInHandAssetSubTypeUtils } from '../../../model/enum/asset/cashinhand-sub-type.enum';
import { DirectEquityAssetSubType, DirectEquityAssetSubTypeUtils } from '../../../model/enum/asset/directequity-sub-type.enum';
import { EPFAssetSubType, EPFAssetSubTypeUtils } from '../../../model/enum/asset/epf-sub-type.enum';
import { FixedDepositAssetSubType, FixedDepositAssetSubTypeUtils } from '../../../model/enum/asset/fixed-deposit-sub-type.enum';
import { GratuityAssetSubType, GratuityAssetSubTypeUtils } from '../../../model/enum/asset/gratuity-sub-type.enum';
import { MutualFundsAssetSubType, MutualFundsAssetSubtypeTypeUtils } from '../../../model/enum/asset/mutual-funds-sub-type.enum';
import { NPSAssetSubType, NPSAssetSubtypeTypeUtils } from '../../../model/enum/asset/nps-sub-type.enum';
import { OtherGovernmentSchemeAssetSubType, OtherGovernmentSchemeAssetSubtypeTypeUtils } from '../../../model/enum/asset/other-government-scheme-sub-type.enum';
import { PersonalAssetSubType, PersonalAssetSubtypeTypeUtils } from '../../../model/enum/asset/personal-sub-type.enum';
import { PPFAssetSubType, PPFAssetSubtypeTypeUtils } from '../../../model/enum/asset/ppf-sub-type.enum';
import { RealEstateAssetSubType, RealEstateAssetSubtypeTypeUtils } from '../../../model/enum/asset/real-estate-sub-type.enum';
import { InsuranceAssetSubType, InsuranceAssetSubTypeUtils } from '../../../model/enum/asset/insurance-sub-type.enum';
import { GoldAssetSubType, GoldAssetSubTypeUtils } from '../../../model/enum/asset/gold-sub-type.enum';
import { BusinessAssetSubType, BusinessAssetSubTypeUtils } from '../../../model/enum/asset/business-sub-type.enum';
import { OtherAssetSubType, OtherAssetSubTypeUtils } from '../../../model/enum/asset/other-sub-type.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { AddAssetTranslations } from './add-assets.translations'
import { ResourcesService } from '../../../services/resources.service';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';
import { AssetCategory } from '../../../model/enum/asset/asset-category.enum'

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css']
})

export class AddAssetsComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  asset: any = {};
  loadingOnSubmit = false;
  ownerOfResourceList = [];
  clientId;
  assetId;
  blockHeader = 'Add Asset';
  addUpdateAssetButtonText = 'Add';
  assetTypeList = AssetTypeUtils.getAllAssetTypes();
  assetSubTypeList: any;
  clientDetails: any
  showHideOtherTextBox = false;
  msgs = [];
  isErrorOccured = false
  translations = AddAssetTranslations;
  tooltipTranslations = TooltipTranslations;
  ownerName;

  assetCategory;

  assetDetailForm = new FormGroup({
    assetNameControl: new FormControl(null, [Validators.required]),
    currentValuationControl: new FormControl(null, [Validators.required]),
    assetOwnerControl: new FormControl(null, [Validators.required]),
    assetTypeControl: new FormControl(null, [Validators.required]),
    assetSubTypeControl: new FormControl(null, [Validators.required]),
    otherAssetSubTypeControl: new FormControl(null, [Validators.required]),
    maturityDateControl: new FormControl(null)
  });

  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
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
      this.assetId = this.route.snapshot.params['assetId'];

      this.route.queryParams.subscribe(params => {
        this.assetCategory = params['selected'];
      })

      this.navbar.routeBackTitle = 'Assets';
      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Add Asset';

      if (this.keyChainService.isLoggedInAsAdmin()) {

        this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

      } else {
        this.navbar.routeBackPath = "/auth/home";

      }

      if (this.assetCategory == AssetCategory.FinancialAsset) {
        this.blockHeader = "Add Financial Asset";
        this.navbar.title = "Add Financial Asset";
        this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 1 };
      } else {
        this.blockHeader = "Add Other Asset"
        this.navbar.title = "Add Other Asset";
        this.navbar.routeBackQueryParams = { selected: 2, selectedSubIndex: 2 };
      }


      this.messageService.sendMessage('show-loading');
      await this.getUserDetails();

      if (this.assetId) {

        await this.getAssetDetails();

        this.blockHeader = 'Edit Asset'
        this.navbar.routeBackTitle = 'Asset Information';
        this.navbar.title = 'Edit Asset';
        this.navbar.isBorderEnabled = true;
        this.addUpdateAssetButtonText = 'Update';
        this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;
        this.getSubAssetType();

        this.assetDetailForm.get('assetTypeControl').disable()
      } else {

        this.ownerName = this.ownerOfResourceList[0].key;
        this.asset.owners = this.ownerName

        let otherAssets = [AssetType.RealEstate, AssetType.Gold, AssetType.PersonalAssets]

        for (let assetType of this.assetTypeList) {
          if (this.assetCategory == AssetCategory.FinancialAsset) {
            if (otherAssets.indexOf(assetType.key) > -1) {
              const removeIndex = this.assetTypeList.indexOf(assetType);
              this.assetTypeList.splice(removeIndex, 1);
            }
          } else {
            this.assetTypeList.filter((asset) => {
              if (otherAssets.indexOf(asset.key) > -1) {
                return true;
              } else {
                const removeIndex = this.assetTypeList.indexOf(asset);
                this.assetTypeList.splice(removeIndex, 1);
                return false;
              }
            })
          }
        }

        this.asset.kind = this.assetTypeList[0].key;
        this.getSubAssetType();
        this.asset.assetSubtype = this.assetSubTypeList[0].key;
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

  didChangeOwner(event) {
    this.asset.owners = event.target.value.split('&');
  }

  async getUserDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.clientDetails = parser.deserialize(response.client, Client);
      this.ownerOfResourceList = this.clientDetails.ownerOfResourceList();
      this.navbar.subTitle = this.clientDetails.name.fullName();
    } catch (error) {
      throw error
    }
  }

  async getAssetDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
      const parser = new JsonConvert()
      this.asset = parser.deserialize(response.asset, Asset);
      this.navbar.subTitle = this.asset.kind + ' (' + this.asset.assetSubtype + ')' + ' of ' + this.clientDetails.name.fullName();

      if (this.asset.owners.length > 1) {
        this.ownerName = this.asset.owners[0] + '&' + this.asset.owners[1]
      } else {
        this.ownerName = this.asset.owners[0]
      }
    } catch (error) {
      throw error
    }
  }

  async didChangeAssetType() {

    this.asset.assetSubtype = null
    this.getSubAssetType()
    this.showAddOtherSubAssetField()

  }

  async getSubAssetType() {
    switch (this.asset.kind) {
      case AssetType.Bond: this.assetSubTypeList = BondAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.RealEstate: this.assetSubTypeList = RealEstateAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.NPS: this.assetSubTypeList = NPSAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.OtherGovernmentSchemes: this.assetSubTypeList = OtherGovernmentSchemeAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.EPF: this.assetSubTypeList = EPFAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.PPF: this.assetSubTypeList = PPFAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.CashInHand: this.assetSubTypeList = CashInHandAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.Insurance: this.assetSubTypeList = InsuranceAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.Gold: this.assetSubTypeList = GoldAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.FixedDeposit: this.assetSubTypeList = FixedDepositAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.DirectEquity: this.assetSubTypeList = DirectEquityAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.MutualFunds: this.assetSubTypeList = MutualFundsAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.Gratuity: this.assetSubTypeList = GratuityAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.PersonalAssets: this.assetSubTypeList = PersonalAssetSubtypeTypeUtils.getAllAssetSubType(); break;
      case AssetType.Business: this.assetSubTypeList = BusinessAssetSubTypeUtils.getAllAssetSubType(); break;
      case AssetType.Other: this.assetSubTypeList = OtherAssetSubTypeUtils.getAllAssetSubType(); break;
    }

    if (this.asset.assetSubtype == null) {
      this.asset.assetSubtype = this.assetSubTypeList[0].key;
    }
  }

  async createBasicAsset() {
    let validationSucceded = true;

    if (this.asset && !this.asset.name) {
      this.assetDetailForm.controls['assetNameControl'].setErrors({ 'required': true });
      this.assetDetailForm.controls['assetNameControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.asset && this.asset.currentValuation == null) {
      this.assetDetailForm.controls['currentValuationControl'].setErrors({ 'required': true });
      this.assetDetailForm.controls['currentValuationControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.asset && this.asset.owners && this.asset.owners.length < 0) {
      this.assetDetailForm.controls['assetOwnerControl'].setErrors({ 'required': true });
      this.assetDetailForm.controls['assetOwnerControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.asset && !this.asset.kind) {
      this.assetDetailForm.controls['assetTypeControl'].setErrors({ 'required': true });
      this.assetDetailForm.controls['assetTypeControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.asset && !this.asset.assetSubtype) {
      this.assetDetailForm.controls['assetSubTypeControl'].setErrors({ 'required': true });
      this.assetDetailForm.controls['assetSubTypeControl'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.assetId) {
        url = 'client/' + this.clientId + '/asset/' + this.assetId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/asset';
        method = RequestMethod.Post;
      }

      if (this.asset.assetSubtype != InsuranceAssetSubType.Term && this.asset.currentValuation == 0) {
        this.loadingOnSubmit = false;
        let message = "Current Valuation cannot be Zero"
        this.msgs = [{ severity: 'error', summary: 'Error', detail: message }];
        return false;
      }


      try {
        const response = await this.httpService.request(method, url, this.asset);

        this.router.navigate(['/auth/client/' + this.clientId + '/asset/' + response.asset._id]);
        this.location.replaceState('/auth/client/' + this.clientId + '/asset/' + response.asset._id);
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

  showAddOtherSubAssetField() {
    if (this.asset.assetSubtype == 'Other') {
      this.showHideOtherTextBox = true;
    } else {
      this.showHideOtherTextBox = false;
    }
  }

  routeBack() {
    this.navbar.routeBack()
  }
}

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component'
import { Asset } from '../../../../model/asset/asset';
import { Liability } from '../../../../model/liability/liability';
import { HttpService } from '../../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { BondAssetSubType, BondAssetSubTypeUtils } from '../../../../model/enum/asset/bond-sub-type.enum';
import { CashInHandAssetSubType, CashInHandAssetSubTypeUtils } from '../../../../model/enum/asset/cashinhand-sub-type.enum';
import { DirectEquityAssetSubType, DirectEquityAssetSubTypeUtils } from '../../../../model/enum/asset/directequity-sub-type.enum';
import { EPFAssetSubType, EPFAssetSubTypeUtils } from '../../../../model/enum/asset/epf-sub-type.enum';
import { FixedDepositAssetSubType, FixedDepositAssetSubTypeUtils } from '../../../../model/enum/asset/fixed-deposit-sub-type.enum';
import { GratuityAssetSubType, GratuityAssetSubTypeUtils } from '../../../../model/enum/asset/gratuity-sub-type.enum';
import { MutualFundsAssetSubType, MutualFundsAssetSubtypeTypeUtils } from '../../../../model/enum/asset/mutual-funds-sub-type.enum';
import { NPSAssetSubType, NPSAssetSubtypeTypeUtils } from '../../../../model/enum/asset/nps-sub-type.enum';
import { OtherGovernmentSchemeAssetSubType, OtherGovernmentSchemeAssetSubtypeTypeUtils } from '../../../../model/enum/asset/other-government-scheme-sub-type.enum';
import { PersonalAssetSubType, PersonalAssetSubtypeTypeUtils } from '../../../../model/enum/asset/personal-sub-type.enum';
import { PPFAssetSubType, PPFAssetSubtypeTypeUtils } from '../../../../model/enum/asset/ppf-sub-type.enum';
import { RealEstateAssetSubType, RealEstateAssetSubtypeTypeUtils } from '../../../../model/enum/asset/real-estate-sub-type.enum';
import { InsuranceAssetSubType, InsuranceAssetSubTypeUtils } from '../../../../model/enum/asset/insurance-sub-type.enum';
import { GoldAssetSubType, GoldAssetSubTypeUtils } from '../../../../model/enum/asset/gold-sub-type.enum';
import { BusinessAssetSubType, BusinessAssetSubTypeUtils } from '../../../../model/enum/asset/business-sub-type.enum';
import { OtherAssetSubType, OtherAssetSubTypeUtils } from '../../../../model/enum/asset/other-sub-type.enum';
import { AssetType, AssetTypeUtils } from '../../../../model/enum/asset/asset-type.enum';
import { MessageService } from '../../../../services/message.service';


@Component({
    selector: 'app-assetClassSetting',
    templateUrl: './assetClassSetting.component.html',
    styleUrls: ['./assetClassSetting.component.css']
})

export class AssetClassSettingComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    assetClassSettingList;
    msgs = [];
    assetTypeList = [];
    configuredAssetObjects = [];
    isErrorOccured = false;
   

    constructor(private httpService: HttpService, private messageService: MessageService, private changeDetector: ChangeDetectorRef) {

    }

    async ngOnInit() {
        this.loadData();
    }

    async loadData() {

        try {
            this.messageService.sendMessage('show-loading');
            const settingsResponse = await this.httpService.request(RequestMethod.Get, 'settings', null);
            this.assetClassSettingList = settingsResponse.settings.assetClassSetting
            for (const asset of this.assetClassSettingList) {
                if (this.assetTypeList.indexOf(asset.assetType) == -1) {
                    this.assetTypeList.push(asset.assetType);
                }
                if (!this.configuredAssetObjects[asset.assetType]) {
                    this.configuredAssetObjects[asset.assetType] = [];
                }
                this.configuredAssetObjects[asset.assetType].push(asset);
            }
            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"
        }

    }

    async saveSettings() {
        try {
            const allAssetList = [];
            for (const assetType of this.assetTypeList) {
                for (const assetSubType of this.configuredAssetObjects[assetType]) {
                    allAssetList.push(assetSubType);
                }
            }
            const response = await this.httpService.request(RequestMethod.Post, `settings/assetClass`, allAssetList);
            this.msgs = []
            this.msgs = [{ severity: 'success', summary: 'Success', detail: response.message }];
        } catch (error) {

            this.msgs = []
            this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        }
    }

    getAssetSubTypeName(kind, assetSubType) {
        switch (kind) {
            case String(AssetType.Bond): return BondAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.RealEstate): return RealEstateAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.NPS): return NPSAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.OtherGovernmentSchemes): return OtherGovernmentSchemeAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.EPF): return EPFAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.PPF): return PPFAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.CashInHand): return CashInHandAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.Insurance): return InsuranceAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.Gold): return GoldAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.FixedDeposit): return FixedDepositAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.DirectEquity): return DirectEquityAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.MutualFunds): return MutualFundsAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.Gratuity): return GratuityAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.PersonalAssets): return PersonalAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.Business): return BusinessAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
            case String(AssetType.Other): return OtherAssetSubTypeUtils.getAssetSubTypeText(assetSubType);
        }
    }

    retry() {
        this.loadData();
    }
}

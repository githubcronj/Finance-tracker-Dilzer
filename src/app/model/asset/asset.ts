import { CommittedSaving } from '../committedSaving';
import { Attachment } from './attachment/attachment';
import { RateOfReturn } from '../../model/rateOfReturn';
import { AssetAllocation } from './assetAllocation/assetAllocation';
import { AssetTypeUtils, AssetType } from '../enum/asset/asset-type.enum';
import { CommittedSavingType, CommittedSavingTypeUtils } from '../enum/asset/committed-saving.enum';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { CommittedSavingFrequencyType } from '../enum/asset/committed-saving-frequency.enum';
import { DatePipe } from '@angular/common';
import { Insurance } from './insurance'
import { FormatterService } from 'app/services/formatter.service';
import { BondAssetSubType, BondAssetSubTypeUtils } from '../enum/asset/bond-sub-type.enum';
import { CashInHandAssetSubType, CashInHandAssetSubTypeUtils } from '../enum/asset/cashinhand-sub-type.enum';
import { DirectEquityAssetSubType, DirectEquityAssetSubTypeUtils } from '../enum/asset/directequity-sub-type.enum';
import { EPFAssetSubType, EPFAssetSubTypeUtils } from '../enum/asset/epf-sub-type.enum';
import { FixedDepositAssetSubType, FixedDepositAssetSubTypeUtils } from '../enum/asset/fixed-deposit-sub-type.enum';
import { GratuityAssetSubType, GratuityAssetSubTypeUtils } from '../enum/asset/gratuity-sub-type.enum';
import { MutualFundsAssetSubType, MutualFundsAssetSubtypeTypeUtils } from '../enum/asset/mutual-funds-sub-type.enum';
import { NPSAssetSubType, NPSAssetSubtypeTypeUtils } from '../enum/asset/nps-sub-type.enum';
import { OtherGovernmentSchemeAssetSubType, OtherGovernmentSchemeAssetSubtypeTypeUtils } from '../enum/asset/other-government-scheme-sub-type.enum';
import { PersonalAssetSubType, PersonalAssetSubtypeTypeUtils } from '../enum/asset/personal-sub-type.enum';
import { PPFAssetSubType, PPFAssetSubtypeTypeUtils } from '../enum/asset/ppf-sub-type.enum';
import { RealEstateAssetSubType, RealEstateAssetSubtypeTypeUtils } from '../enum/asset/real-estate-sub-type.enum';
import { InsuranceAssetSubType, InsuranceAssetSubTypeUtils } from '../enum/asset/insurance-sub-type.enum';
import { GoldAssetSubType, GoldAssetSubTypeUtils } from '../enum/asset/gold-sub-type.enum';
import { BusinessAssetSubType, BusinessAssetSubTypeUtils } from '../enum/asset/business-sub-type.enum';
import { OtherAssetSubType, OtherAssetSubTypeUtils } from '../enum/asset/other-sub-type.enum';

@JsonObject
export abstract class Asset {

  @JsonProperty("_id", String) _id: string = undefined
  @JsonProperty("kind", String) kind: string = undefined
  @JsonProperty("name", String) name: string = undefined
  @JsonProperty("currentValuation", Number) currentValuation: number = undefined
  @JsonProperty("owners", [String]) owners: string[] = []
  @JsonProperty("assetSubtype", String) assetSubtype: string = undefined
  @JsonProperty("committedSavings", [CommittedSaving]) committedSavings: CommittedSaving[] = []
  @JsonProperty("rateOfReturns", [RateOfReturn]) rateOfReturns: RateOfReturn[] = []
  @JsonProperty("currentAssetAllocation", AssetAllocation) currentAssetAllocation: AssetAllocation = undefined
  @JsonProperty("desiredAssetAllocation", AssetAllocation) desiredAssetAllocation: AssetAllocation = undefined
  @JsonProperty("attachments", [Attachment]) attachments: Attachment[] = []
  @JsonProperty("description", String) description: string = undefined
  @JsonProperty("needInsuranceAnalysis", Boolean) needInsuranceAnalysis: boolean = undefined;
  @JsonProperty("maturityDate", Date) maturityDate: Date = undefined
  @JsonProperty("createdAt", Date) createdAt: Date = undefined
  @JsonProperty("updatedAt", Date) updatedAt: Date = undefined

  formatter = new FormatterService()
  isSelected = false;

  static discriminatorInfo = {
    key: "kind",
    subclasses: {
      "Bond": "Bond",
      "CashInHand": "CashInHand",
      "DirectEquity": "DirectEquity",
      "EPF": "EPF",
      "FixedDeposit": "FixedDeposit",
      "Gratuity": "Gratuity",
      "MutualFunds": "MutualFunds",
      "NPS": "NPS",
      "OtherGovernmentSchemes": "OtherGovernmentSchemes",
      "PersonalAsset": "PersonalAsset",
      "PPF": "PPF",
      "RealEstate": "RealEstate",
      "Insurance": "Insurance",
      "Gold": "Gold",
      "Business": "Business",
      "Other": "Other"
    }
  }


  constructor() {

    let subtypes = this.subTypesOptions()
    if (subtypes.length > 0) {
      this.assetSubtype = subtypes[0].value;
    }
    this.committedSavings = []
    this.attachments = []
  }

  subTypesOptions() {
    return [];
  }

  displayAssetTypeName() {
    return AssetTypeUtils.getAssetTypeText(this.kind);
  }

  image() {
    return AssetTypeUtils.getAssetTypeImageName(this.kind)
  }

  createdDateDisplayString() {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(this.createdAt, 'dd/MM/yyyy');
  }

  totalCommitedSavingDisplayString() {
    let lumpsumSaving = 0
    let regularSaving = 0

    if (this.kind == String(AssetType.Insurance)) {


    } else {
      for (let committedSaving of this.committedSavings) {
        if (committedSaving.kind == String(CommittedSavingType.LupsumDeposit)) {
          lumpsumSaving += committedSaving.amount
        } else {
          if (committedSaving.frequency == CommittedSavingFrequencyType.HalfYearly) {
            regularSaving += (committedSaving.amount * 2)
          } else if (committedSaving.frequency == CommittedSavingFrequencyType.Quarterly) {
            regularSaving += (committedSaving.amount * 4)
          } else if (committedSaving.frequency == CommittedSavingFrequencyType.Monthly) {
            regularSaving += (committedSaving.amount * 12)
          } else {
            regularSaving += committedSaving.amount
          }
        }
      }
    }


    let displayString = ""

    if (regularSaving > 0) {
      displayString = `₹ ${this.displayCurrencyString(regularSaving)} regular deposit per annum`
    }
    if (lumpsumSaving > 0) {
      if (displayString.length > 0) {
        displayString = displayString + " & "
      }
      displayString = displayString + `₹ ${this.displayCurrencyString(lumpsumSaving)} lumpsum deposit`
    }

    return displayString

  }

  static categorizeAssets(assets) {

    var otherAssetArray = [String(AssetType.PersonalAssets), String(AssetType.Gold), String(AssetType.RealEstate)];

    let assetsCategory = {
      financialAssets: [],
      otherAssets: [],
      totalFinancialAssetsValuation: 0,
      totalOtherAssetsValuation: 0
    }

    const groupedAsset = this.groupByAssetType(assets);
    for (let asset of groupedAsset) {
      if (otherAssetArray.indexOf(asset.kind) > -1) {
        assetsCategory.otherAssets.push(asset)
        assetsCategory.totalOtherAssetsValuation += asset.currentValuation
      } else {
        assetsCategory.financialAssets.push(asset)
        assetsCategory.totalFinancialAssetsValuation += asset.currentValuation
      }
    }

    return assetsCategory

  }

  formatCurrency(amount) {
    return amount.toLocaleString();
  }
  static calculateCommittedSavingsData(assets) {

    let committedSavingsInfo = {
      committedSavings: [],
      totalCommittedSavingAmount: 0
    }

    for (let asset of assets) {

      for (let saving of asset.committedSavings) {
        committedSavingsInfo.committedSavings.push(saving)

        if (saving.kind == String(CommittedSavingType.LupsumDeposit)) {
          committedSavingsInfo.totalCommittedSavingAmount += saving.amount
        } else {
          if (saving.frequency == CommittedSavingFrequencyType.HalfYearly) {
            committedSavingsInfo.totalCommittedSavingAmount += (saving.amount * 2)
          } else if (saving.frequency == CommittedSavingFrequencyType.Quarterly) {
            committedSavingsInfo.totalCommittedSavingAmount += (saving.amount * 4)
          } else if (saving.frequency == CommittedSavingFrequencyType.Monthly) {
            committedSavingsInfo.totalCommittedSavingAmount += (saving.amount * 12)
          } else {
            committedSavingsInfo.totalCommittedSavingAmount += saving.amount
          }
        }
      }
    }

    return committedSavingsInfo
  }

  displayCurrencyString(amount) {

    return this.formatter.currencyFormatter(amount);

  }

  static groupByAssetType(assetsList) {
    let groupedAssets = [];
    for (const asset of assetsList) {
      if (groupedAssets.indexOf(asset) == -1) {
        const filter = assetsList.filter(a => a.kind == asset.kind);
        groupedAssets = groupedAssets.concat(filter);
      }
    }
    return groupedAssets;
  }

  getSubAssetType() {
    switch (this.kind) {
      case String(AssetType.Bond): return BondAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.RealEstate): return RealEstateAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.NPS): return NPSAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.OtherGovernmentSchemes): return OtherGovernmentSchemeAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.EPF): return EPFAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.PPF): return PPFAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.CashInHand): return CashInHandAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.Insurance): return InsuranceAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.Gold): return GoldAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.FixedDeposit): return FixedDepositAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.DirectEquity): return DirectEquityAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.MutualFunds): return MutualFundsAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.Gratuity): return GratuityAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.PersonalAssets): return PersonalAssetSubtypeTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.Business): return BusinessAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
      case String(AssetType.Other): return OtherAssetSubTypeUtils.getAssetSubTypeText(this.assetSubtype);
    }
  }


}

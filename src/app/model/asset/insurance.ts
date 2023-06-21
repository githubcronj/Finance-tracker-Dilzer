import { Asset } from './asset';
import { InsuranceAssetSubTypeUtils } from '../enum/asset/insurance-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { InsuranceFrequencyType, InsuranceFrequencyTypeUtils } from '../enum/asset/insurance-frequency-type.enum'
import { SurvivalBenefit } from './survivalBenefit';

@JsonObject
export class Insurance extends Asset {

    @JsonProperty("sumAssured", Number) sumAssured: number = undefined
    @JsonProperty("deathBenefit", Number) deathBenefit: number = undefined
    @JsonProperty("premium", Number) premium: number = undefined
    @JsonProperty("premiumStartDate", Date) premiumStartDate: Date = undefined
    @JsonProperty("premiumEndDate", Date) premiumEndDate: Date = undefined
    @JsonProperty("numberOfPremiumPaid", Number) numberOfPremiumPaid: number = undefined
    @JsonProperty("numberOfPremiumPayable", Number) numberOfPremiumPayable: number = undefined
    @JsonProperty("bonus", Number) bonus: number = undefined
    @JsonProperty("survivalBenefits", [SurvivalBenefit]) survivalBenefits: SurvivalBenefit[] = []
    @JsonProperty("premiumFrequency", Number) premiumFrequency: number = undefined

    constructor() {
        super()
        this.kind = String(AssetType.Insurance)
        this.survivalBenefits = []
    }

    subTypesOptions() {
        return InsuranceAssetSubTypeUtils.getAllAssetSubType()
    }

    premiumFrequencyDisplayString() {
        return InsuranceFrequencyTypeUtils.getInsuranceFrequencyTypeText(this.premiumFrequency)
    }


    displayAnnualPremium() {
        let annualPremium = 0

        if (this.premiumFrequency == InsuranceFrequencyType.HalfYearly) {
            annualPremium = (this.premium * 2)
        } else if (this.premiumFrequency == InsuranceFrequencyType.Quarterly) {
            annualPremium = (this.premium * 4)
        } else if (this.premiumFrequency == InsuranceFrequencyType.Monthly) {
            annualPremium = (this.premium * 12)
        } else {
            annualPremium = this.premium
        }

        let displayString = ""

        if (annualPremium > 0) {
           
            displayString = ` ${this.displayCurrencyString(annualPremium)} per annum`
        }

        return displayString

    }



    totalCommitedSavingDisplayString() {
        let annualPremium = 0

        if (this.premiumFrequency == InsuranceFrequencyType.HalfYearly) {
            annualPremium = (this.premium * 2)
        } else if (this.premiumFrequency == InsuranceFrequencyType.Quarterly) {
            annualPremium = (this.premium * 4)
        } else if (this.premiumFrequency == InsuranceFrequencyType.Monthly) {
            annualPremium = (this.premium * 12)
        } else {
            annualPremium = this.premium
        }

        let displayString = ""

        if (annualPremium > 0) {
            displayString = `₹ ${this.displayCurrencyString(annualPremium)} premium per annum`
        }

        return displayString

    }



}
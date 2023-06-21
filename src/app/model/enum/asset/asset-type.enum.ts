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


export enum AssetType {
    RealEstate = <any>'RealEstate',
    NPS = <any>'NPS',
    OtherGovernmentSchemes = <any>'OtherGovernmentSchemes',
    EPF = <any>'EPF',
    PPF = <any>'PPF',
    CashInHand = <any>'CashInHand',
    Insurance = <any>'Insurance',
    Gold = <any>'Gold',
    FixedDeposit = <any>'FixedDeposit',
    DirectEquity = <any>'DirectEquity',
    Bond = <any>'Bond',
    MutualFunds = <any>'MutualFunds',
    Gratuity = <any>'Gratuity',
    PersonalAssets = <any>'PersonalAsset',
    Business = <any>'Business',
    Other = <any>'Other'

}

export class AssetTypeUtils {

    public static getColorCode(assestType) {
        switch (assestType) {
            case AssetType.RealEstate: return '#C0392B';
            case AssetType.NPS: return '#AF7AC5';
            case AssetType.OtherGovernmentSchemes: return '#5DADE2';
            case AssetType.EPF: return '#76D7C4';
            case AssetType.PPF: return '#52BE80';
            case AssetType.CashInHand: return '#F4D03F';
            case AssetType.Insurance: return '#BA4A00';
            case AssetType.Gold: return '#626567';
            case AssetType.FixedDeposit: return '#4A235A';
            case AssetType.DirectEquity: return '#273746';
            case AssetType.Bond: return '#1D8348';
            case AssetType.MutualFunds: return '#FFA07A';
            case AssetType.Gratuity: return '#A4B20D';
            case AssetType.PersonalAssets: return '#ED71EE';
            case AssetType.Business: return '#C70F56';
            case AssetType.Other: return '#652FD1';

        }
    }
    public static getAssetTypeText(assests) {
        switch (assests) {
            case AssetType.RealEstate: return 'Real Estate';
            case AssetType.NPS: return 'NPS';
            case AssetType.OtherGovernmentSchemes: return 'Other Government Schemes';
            case AssetType.EPF: return 'EPF';
            case AssetType.PPF: return 'PPF';
            case AssetType.CashInHand: return 'Cash In Hand';
            case AssetType.Insurance: return 'Insurance';
            case AssetType.Gold: return 'Gold';
            case AssetType.FixedDeposit: return 'Fixed Deposit';
            case AssetType.DirectEquity: return 'Direct Equity';
            case AssetType.Bond: return 'Bonds';
            case AssetType.MutualFunds: return 'Mutual Funds';
            case AssetType.Gratuity: return 'Gratuity';
            case AssetType.PersonalAssets: return 'Personal Assets';
            case AssetType.Business: return 'Business';
            case AssetType.Other: return 'Other';

        }
    }

    public static getAssetKindName(asset) {
        switch (asset) {
            case 'Real Estate': return AssetType.RealEstate;
            case 'NPS': return AssetType.NPS;
            case 'Other Government Schemes': return AssetType.OtherGovernmentSchemes;
            case 'EPF': return AssetType.EPF;
            case 'PPF': return AssetType.PPF;
            case 'Cash In Hand': return AssetType.CashInHand;
            case 'Insurance': return AssetType.Insurance;
            case 'Gold': return AssetType.Gold;
            case 'Fixed Deposit': return AssetType.FixedDeposit;
            case 'Direct Equity': return AssetType.DirectEquity;
            case 'Bonds': return AssetType.Bond;
            case 'Mutual Funds': return AssetType.MutualFunds;
            case 'Gratuity': return AssetType.Gratuity;
            case 'Personal Assets': return AssetType.PersonalAssets;
            case 'Business': return AssetType.Business;
            case 'Other': return AssetType.Other;
        }
    }

    public static getAssetTypeImageName(assests) {
        switch (assests) {
            case AssetType.RealEstate: return 'real_estate_icon.png';
            case AssetType.NPS: return 'nps_icon.png';
            case AssetType.OtherGovernmentSchemes: return 'other_government_scheme_icon.png';
            case AssetType.EPF: return 'epf_icon.png';
            case AssetType.PPF: return 'ppf_icon.png';
            case AssetType.CashInHand: return 'cash_in_hand_icon.png';
            case AssetType.Insurance: return 'insurance_icon.png';
            case AssetType.Gold: return 'gold_icon.png';
            case AssetType.FixedDeposit: return 'fixed_deposit_icon.png';
            case AssetType.DirectEquity: return 'direct_equity_icon.png';
            case AssetType.Bond: return 'bonds_icon.png';
            case AssetType.MutualFunds: return 'mutual_funds_icon.png';
            case AssetType.Gratuity: return 'gratuity_icon.png';
            case AssetType.PersonalAssets: return 'personal_asset.png';
            case AssetType.Business: return 'business_icon.png';
            case AssetType.Other: return 'other_icon.png';

        }
    }

    public static getAssetSubTypeName(kind, assetSubtype) {

        switch (kind) {

            case String(AssetType.Bond): return BondAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.RealEstate): return RealEstateAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.NPS): return NPSAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.OtherGovernmentSchemes): return OtherGovernmentSchemeAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.EPF): return EPFAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.PPF): return PPFAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.CashInHand): return CashInHandAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.Insurance): return InsuranceAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.Gold): return GoldAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.FixedDeposit): return FixedDepositAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.DirectEquity): return DirectEquityAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.MutualFunds): return MutualFundsAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.Gratuity): return GratuityAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.PersonalAssets): return PersonalAssetSubtypeTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.Business): return BusinessAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
            case String(AssetType.Other): return OtherAssetSubTypeUtils.getAssetSubTypeText(assetSubtype);
        }
    }

    public static getAllAssetTypes() {
        const options = [
            {
                key: AssetType.RealEstate,
                value: this.getAssetTypeText(AssetType.RealEstate),
                image: this.getAssetTypeImageName(AssetType.RealEstate)
            },
            {
                key: AssetType.NPS,
                value: this.getAssetTypeText(AssetType.NPS),
                image: this.getAssetTypeImageName(AssetType.NPS)
            },
            {
                key: AssetType.OtherGovernmentSchemes,
                value: this.getAssetTypeText(AssetType.OtherGovernmentSchemes),
                image: this.getAssetTypeImageName(AssetType.OtherGovernmentSchemes)
            },
            {
                key: AssetType.EPF,
                value: this.getAssetTypeText(AssetType.EPF),
                image: this.getAssetTypeImageName(AssetType.EPF)
            },
            {
                key: AssetType.PPF,
                value: this.getAssetTypeText(AssetType.PPF),
                image: this.getAssetTypeImageName(AssetType.PPF)
            },
            {
                key: AssetType.CashInHand,
                value: this.getAssetTypeText(AssetType.CashInHand),
                image: this.getAssetTypeImageName(AssetType.CashInHand)
            },
            {
                key: AssetType.Insurance,
                value: this.getAssetTypeText(AssetType.Insurance),
                image: this.getAssetTypeImageName(AssetType.Insurance)
            },
            {
                key: AssetType.Gold,
                value: this.getAssetTypeText(AssetType.Gold),
                image: this.getAssetTypeImageName(AssetType.Gold)
            },
            {
                key: AssetType.FixedDeposit,
                value: this.getAssetTypeText(AssetType.FixedDeposit),
                image: this.getAssetTypeImageName(AssetType.FixedDeposit)
            },
            {
                key: AssetType.DirectEquity,
                value: this.getAssetTypeText(AssetType.DirectEquity),
                image: this.getAssetTypeImageName(AssetType.DirectEquity)
            },
            {
                key: AssetType.Bond,
                value: this.getAssetTypeText(AssetType.Bond),
                image: this.getAssetTypeImageName(AssetType.Bond)
            },
            {
                key: AssetType.MutualFunds,
                value: this.getAssetTypeText(AssetType.MutualFunds),
                image: this.getAssetTypeImageName(AssetType.MutualFunds)
            },
            {
                key: AssetType.Gratuity,
                value: this.getAssetTypeText(AssetType.Gratuity),
                image: this.getAssetTypeImageName(AssetType.Gratuity)
            },
            {
                key: AssetType.PersonalAssets,
                value: this.getAssetTypeText(AssetType.PersonalAssets),
                image: this.getAssetTypeImageName(AssetType.PersonalAssets)
            },
            {
                key: AssetType.Business,
                value: this.getAssetTypeText(AssetType.Business),
                image: this.getAssetTypeImageName(AssetType.Business)
            },
            {
                key: AssetType.Other,
                value: this.getAssetTypeText(AssetType.Other),
                image: this.getAssetTypeImageName(AssetType.Other)
            }
        ];
        return options;
    }
}

export enum FinancialAsset {
    LifeInsurancePolicies = 0,
    FDsRDs = 1,
    MutualFunds = 2,
    DirectEquity = 3,
    PMS = 4,
    PPF = 5,
    EPF_VPF = 6,
    Other = 7
}

export class FinancialAssetUtils {
    public static getFinancialAssetText(assests) {
        switch (assests) {
            case FinancialAsset.LifeInsurancePolicies: return 'Life Insurance Policies';
            case FinancialAsset.FDsRDs: return 'FDs/RDs';
            case FinancialAsset.MutualFunds: return 'Mutual Funds';
            case FinancialAsset.DirectEquity: return 'Direct Equity';
            case FinancialAsset.PMS: return 'PMS';
            case FinancialAsset.PPF: return 'PPF';
            case FinancialAsset.EPF_VPF: return 'EPF/VPF';
            case FinancialAsset.Other: return 'Other';
        }
    }

    public static getAllFinancialAssets() {
        const options = [
            {
                key: FinancialAsset.LifeInsurancePolicies,
                value: this.getFinancialAssetText(FinancialAsset.LifeInsurancePolicies)
            },
            {
                key: FinancialAsset.FDsRDs,
                value: this.getFinancialAssetText(FinancialAsset.FDsRDs)
            },
            {
                key: FinancialAsset.MutualFunds,
                value: this.getFinancialAssetText(FinancialAsset.MutualFunds)
            },
            {
                key: FinancialAsset.DirectEquity,
                value: this.getFinancialAssetText(FinancialAsset.DirectEquity)
            },
            {
                key: FinancialAsset.PMS,
                value: this.getFinancialAssetText(FinancialAsset.PMS)
            },
            {
                key: FinancialAsset.PPF,
                value: this.getFinancialAssetText(FinancialAsset.PPF)
            },
            {
                key: FinancialAsset.EPF_VPF,
                value: this.getFinancialAssetText(FinancialAsset.EPF_VPF)
            },
             {
                key: FinancialAsset.Other,
                value: this.getFinancialAssetText(FinancialAsset.Other)
            }
        ];
        return options;
    }
}
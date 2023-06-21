export enum MutualFundsAssetSubType {
    Equity = <any>'Equity',
    Debt = <any>'Debt',
    ETF = <any>'ETF',
    Other = <any>'Other'
}


export class MutualFundsAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case MutualFundsAssetSubType.Equity: return 'Equity';
            case MutualFundsAssetSubType.Debt: return 'Debt';
            case MutualFundsAssetSubType.ETF: return 'ETF';
            case MutualFundsAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: MutualFundsAssetSubType.Equity,
                value: this.getAssetSubTypeText(MutualFundsAssetSubType.Equity)
            },
            {
                key: MutualFundsAssetSubType.Debt,
                value: this.getAssetSubTypeText(MutualFundsAssetSubType.Debt)
            },
            {
                key: MutualFundsAssetSubType.ETF,
                value: this.getAssetSubTypeText(MutualFundsAssetSubType.ETF)
            },
            {
                key: MutualFundsAssetSubType.Other,
                value: this.getAssetSubTypeText(MutualFundsAssetSubType.Other)
            }
        ];
        return options;
    }
}

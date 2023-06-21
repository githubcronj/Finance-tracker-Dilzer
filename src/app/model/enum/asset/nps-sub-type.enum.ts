export enum NPSAssetSubType {
    Tier1Equity = <any>'Tier1Equity',
    Tier1Debt = <any>'Tier1Debt',
    Tier2Equity = <any>'Tier2Equity',
    Tier2Debt = <any>'Tier2Debt',
    Other = <any>'Other'
}

export class NPSAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case NPSAssetSubType.Tier1Equity: return 'Tier 1 Equity';
            case NPSAssetSubType.Tier1Debt: return 'Tier 1 Debt';
            case NPSAssetSubType.Tier2Equity: return 'Tier 2 Equity';
            case NPSAssetSubType.Tier2Debt: return 'Tier 2 Debt';
            case NPSAssetSubType.Other: return 'Other';
        }
    }


    public static getAllAssetSubType() {
        const options = [
            {
                key: NPSAssetSubType.Tier1Equity,
                value: this.getAssetSubTypeText(NPSAssetSubType.Tier1Equity)
            },
            {
                key: NPSAssetSubType.Tier1Debt,
                value: this.getAssetSubTypeText(NPSAssetSubType.Tier1Debt)
            },
            {
                key: NPSAssetSubType.Tier2Equity,
                value: this.getAssetSubTypeText(NPSAssetSubType.Tier2Equity)
            },
            {
                key: NPSAssetSubType.Tier2Debt,
                value: this.getAssetSubTypeText(NPSAssetSubType.Tier2Debt)
            },
            {
                key: NPSAssetSubType.Other,
                value: this.getAssetSubTypeText(NPSAssetSubType.Other)
            }
        ];
        return options;
    }
}

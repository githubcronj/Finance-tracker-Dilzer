export enum GoldAssetSubType {
    GoldCoins = <any>'GoldCoins',
    GoldBars = <any>'GoldBars',
    SovereignGoldBonds = <any>'SovereignGoldBonds',
    GoldETF = <any>'GoldETF',
    Other = <any>'Other'
}

export class GoldAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case GoldAssetSubType.GoldCoins: return 'Gold Coins';
            case GoldAssetSubType.GoldBars: return 'Gold Bars';
            case GoldAssetSubType.SovereignGoldBonds: return 'Sovereign Gold Bonds';
            case GoldAssetSubType.Other: return 'Gold ETF';
            case GoldAssetSubType.GoldETF: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: GoldAssetSubType.GoldCoins,
                value: this.getAssetSubTypeText(GoldAssetSubType.GoldCoins)
            },
            {
                key: GoldAssetSubType.GoldBars,
                value: this.getAssetSubTypeText(GoldAssetSubType.GoldBars)
            },
            {
                key: GoldAssetSubType.SovereignGoldBonds,
                value: this.getAssetSubTypeText(GoldAssetSubType.SovereignGoldBonds)
            },
            {
                key: GoldAssetSubType.GoldETF,
                value: this.getAssetSubTypeText(GoldAssetSubType.GoldETF)
            },
            {
                key: GoldAssetSubType.Other,
                value: this.getAssetSubTypeText(GoldAssetSubType.Other)
            }
        ];
        return options;
    }
}

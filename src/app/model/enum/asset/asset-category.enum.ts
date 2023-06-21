export enum AssetCategory {
    FinancialAsset = 0,
    OtherAsset = 1
}

export class AssetCategoryUtils {
    public static getAssetCategoryText(asset) {
        switch (asset) {
            case AssetCategory.FinancialAsset: return 'Financial Asset';
            case AssetCategory.OtherAsset: return 'Other Asset';
        }
    }

    public static getAllAssetCategory() {
        const options = [
            {
                key: AssetCategory.FinancialAsset,
                value: this.getAssetCategoryText(AssetCategory.FinancialAsset)
            },
            {
                key: AssetCategory.OtherAsset,
                value: this.getAssetCategoryText(AssetCategory.OtherAsset)
            }
        ];
        return options;
    }
}

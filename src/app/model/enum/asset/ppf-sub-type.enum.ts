export enum PPFAssetSubType {
    PPF = <any>'PPF',
    Other = <any>'Other'
}

export class PPFAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case PPFAssetSubType.PPF: return 'PPF';
            case PPFAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: PPFAssetSubType.PPF,
                value: this.getAssetSubTypeText(PPFAssetSubType.PPF)
            },
            {
                key: PPFAssetSubType.Other,
                value: this.getAssetSubTypeText(PPFAssetSubType.Other)
            }
        ];
        return options;
    }
}

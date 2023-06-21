export enum OtherAssetSubType {
    Other = <any>'Other'
}

export class OtherAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case OtherAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: OtherAssetSubType.Other,
                value: this.getAssetSubTypeText(OtherAssetSubType.Other)
            }
        ];
        return options;
    }
}

export enum BusinessAssetSubType {
    Business = <any>'Business',
    Other = <any>'Other'
}


export class BusinessAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case BusinessAssetSubType.Business: return 'Business';
            case BusinessAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: BusinessAssetSubType.Business,
                value: this.getAssetSubTypeText(BusinessAssetSubType.Business)
            },
            {
                key: BusinessAssetSubType.Other,
                value: this.getAssetSubTypeText(BusinessAssetSubType.Other)
            }
        ];
        return options;
    }
}

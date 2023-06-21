export enum GratuityAssetSubType {
    Gratuity = <any>'Gratuity',
    Other = <any>'Other'
}


export class GratuityAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case GratuityAssetSubType.Gratuity: return 'Gratuity';
            case GratuityAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: GratuityAssetSubType.Gratuity,
                value: this.getAssetSubTypeText(GratuityAssetSubType.Gratuity)
            },
            {
                key: GratuityAssetSubType.Other,
                value: this.getAssetSubTypeText(GratuityAssetSubType.Other)
            }
        ];
        return options;
    }
}

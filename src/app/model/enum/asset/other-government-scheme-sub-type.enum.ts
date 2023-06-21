export enum OtherGovernmentSchemeAssetSubType {
    NSC = <any>'NSC',
    KVP = <any>'KVP',
    IVP = <any>'IVP',
    POMIS = <any>'POMIS',
    Other = <any>'Other'
}

export class OtherGovernmentSchemeAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case OtherGovernmentSchemeAssetSubType.NSC: return 'NSC';
            case OtherGovernmentSchemeAssetSubType.KVP: return ' KVP';
            case OtherGovernmentSchemeAssetSubType.IVP: return ' IVP';
            case OtherGovernmentSchemeAssetSubType.POMIS: return ' POMIS';
            case OtherGovernmentSchemeAssetSubType.Other: return ' Other';
        }
    }



    public static getAllAssetSubType() {
        const options = [
            {
                key: OtherGovernmentSchemeAssetSubType.NSC,
                value: this.getAssetSubTypeText(OtherGovernmentSchemeAssetSubType.NSC)
            },
            {
                key: OtherGovernmentSchemeAssetSubType.KVP,
                value: this.getAssetSubTypeText(OtherGovernmentSchemeAssetSubType.KVP)
            },
            {
                key: OtherGovernmentSchemeAssetSubType.IVP,
                value: this.getAssetSubTypeText(OtherGovernmentSchemeAssetSubType.IVP)
            },
            {
                key: OtherGovernmentSchemeAssetSubType.POMIS,
                value: this.getAssetSubTypeText(OtherGovernmentSchemeAssetSubType.POMIS)
            },
            {
                key: OtherGovernmentSchemeAssetSubType.Other,
                value: this.getAssetSubTypeText(OtherGovernmentSchemeAssetSubType.Other)
            }
        ];
        return options;
    }
}

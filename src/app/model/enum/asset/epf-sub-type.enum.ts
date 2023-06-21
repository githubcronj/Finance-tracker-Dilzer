export enum EPFAssetSubType {
    EPF = <any>'EPF',
    VPF = <any>'VPF',
    FourZeroOneK = <any>'401K',
    Other = <any>'Other'
}

export class EPFAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case EPFAssetSubType.EPF: return 'EPF';
            case EPFAssetSubType.VPF: return 'VPF';
            case EPFAssetSubType.FourZeroOneK: return '401K';
            case EPFAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: EPFAssetSubType.EPF,
                value: this.getAssetSubTypeText(EPFAssetSubType.EPF)
            },
            {
                key: EPFAssetSubType.VPF,
                value: this.getAssetSubTypeText(EPFAssetSubType.VPF)
            },
            {
                key: EPFAssetSubType.FourZeroOneK,
                value: this.getAssetSubTypeText(EPFAssetSubType.FourZeroOneK)
            },
            {
                key: EPFAssetSubType.Other,
                value: this.getAssetSubTypeText(EPFAssetSubType.Other)
            }
        ];
        return options;
    }
}

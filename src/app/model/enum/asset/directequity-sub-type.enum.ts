export enum DirectEquityAssetSubType {
    Stock = <any>'Stock',
    RSU = <any>'RSU',
    ESOP = <any>'ESOP',
    ESPP = <any>'ESPP',
    PMS = <any>'PMS',
    InternationalEquity = <any>'InternationalEquity',
    EquityETF = <any>'EquityETF',
    Other = <any>'Other'
}


export class DirectEquityAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case DirectEquityAssetSubType.Stock: return 'Stock';
            case DirectEquityAssetSubType.RSU: return 'RSU';
            case DirectEquityAssetSubType.ESOP: return 'ESOP';
            case DirectEquityAssetSubType.ESPP: return 'ESPP';
            case DirectEquityAssetSubType.PMS: return 'PMS';
            case DirectEquityAssetSubType.InternationalEquity: return 'International Equity';
            case DirectEquityAssetSubType.EquityETF: return 'Equity ETF';
            case DirectEquityAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: DirectEquityAssetSubType.Stock,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.Stock)
            },
            {
                key: DirectEquityAssetSubType.RSU,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.RSU)
            },
            {
                key: DirectEquityAssetSubType.ESOP,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.ESOP)
            },
            {
                key: DirectEquityAssetSubType.ESPP,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.ESPP)
            },
            {
                key: DirectEquityAssetSubType.PMS,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.PMS)
            },
            {
                key: DirectEquityAssetSubType.InternationalEquity,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.InternationalEquity)
            },
            {
                key: DirectEquityAssetSubType.EquityETF,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.EquityETF)
            },
            {
                key: DirectEquityAssetSubType.Other,
                value: this.getAssetSubTypeText(DirectEquityAssetSubType.Other)
            }
        ];
        return options;
    }
}

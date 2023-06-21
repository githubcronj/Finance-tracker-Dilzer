
export enum BondAssetSubType {
    GovernmentBonds = <any>'GovernmentBonds',
    InfrastructureBonds = <any>'InfrastructureBonds',
    CorporateBonds = <any>'CorporateBonds',
    DebtETF = <any>'DebtETF',
    Other = <any>'Other'
}


export class BondAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case BondAssetSubType.GovernmentBonds: return 'Government Bonds';
            case BondAssetSubType.InfrastructureBonds: return 'Infrastructure Bonds';
            case BondAssetSubType.CorporateBonds: return 'Corporate Bonds';
            case BondAssetSubType.DebtETF: return 'Debt ETF';
            case BondAssetSubType.Other: return 'Other';
        }
    }


    public static getAllAssetSubType() {
        const options = [
            {
                key: BondAssetSubType.GovernmentBonds,
                value: this.getAssetSubTypeText(BondAssetSubType.GovernmentBonds)
            },
            {
                key: BondAssetSubType.InfrastructureBonds,
                value: this.getAssetSubTypeText(BondAssetSubType.InfrastructureBonds)
            },
            {
                key: BondAssetSubType.CorporateBonds,
                value: this.getAssetSubTypeText(BondAssetSubType.CorporateBonds)
            },
            {
                key: BondAssetSubType.DebtETF,
                value: this.getAssetSubTypeText(BondAssetSubType.DebtETF)
            },
            {
                key: BondAssetSubType.Other,
                value: this.getAssetSubTypeText(BondAssetSubType.Other)
            }
        ];
        return options;
    }
}

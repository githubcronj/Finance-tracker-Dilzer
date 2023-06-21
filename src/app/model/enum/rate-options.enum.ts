export enum RateOptionsType {
    SetByClientRiskProfile = 0,
    SetManually = 1,
    SetByRiskProfile = 2,
    SetByAssetClass = 3,
    DoNotInclude = 4

}

export class RateOptionsTypeUtils {
    public static getRateOptionsTypeText(assests) {
        switch (assests) {
            case RateOptionsType.SetByRiskProfile: return 'Set By Risk Profile';
            case RateOptionsType.SetManually: return 'Set Manually';
            case RateOptionsType.SetByClientRiskProfile: return 'Set By Client Risk Profile';
            case RateOptionsType.SetByAssetClass: return 'Set By Asset Class';
            case RateOptionsType.DoNotInclude: return 'Do not include'
        }
    }


    public static getAllRateOfReturnType() {
        const options = [
            {
                key: RateOptionsType.SetByClientRiskProfile,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByClientRiskProfile)
            },
            {
                key: RateOptionsType.SetManually,
                value: this.getRateOptionsTypeText(RateOptionsType.SetManually)
            },
            {
                key: RateOptionsType.SetByRiskProfile,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByRiskProfile)
            },
            {
                key: RateOptionsType.SetByAssetClass,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByAssetClass)
            }
        ];
        return options;
    }

    public static getAllCurrentAssetAllocationType() {

        const options = [
            {
                key: RateOptionsType.DoNotInclude,
                value: this.getRateOptionsTypeText(RateOptionsType.DoNotInclude)
            },
            {
                key: RateOptionsType.SetByAssetClass,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByAssetClass)
            }
        ];
        return options;
    }

    public static getAllDesiredAssetAllocationType() {

        const options = [
            {
                key: RateOptionsType.DoNotInclude,
                value: this.getRateOptionsTypeText(RateOptionsType.DoNotInclude)
            },
            {
                key: RateOptionsType.SetByRiskProfile,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByRiskProfile)
            },
            {
                key: RateOptionsType.SetByClientRiskProfile,
                value: this.getRateOptionsTypeText(RateOptionsType.SetByClientRiskProfile)
            }
        ];
        return options;
    }
}

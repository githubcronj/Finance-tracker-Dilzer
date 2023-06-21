export enum DesiredAssetAllocationType {
    DoNotInclude = 0,
    SetByRiskProfile = 1,
    
}

export class DesiredAssetAllocationTypeUtils {
    public static getDesiredAssetAllocationTypeText(assests) {
        switch (assests) {
            case DesiredAssetAllocationType.SetByRiskProfile: return 'Set By Risk Profile';
            case DesiredAssetAllocationType.DoNotInclude: return 'Do not include'
           
        }
    }


    public static getAllDesiredAssetAllocationType() {
        const options = [
            {
                key: DesiredAssetAllocationType.DoNotInclude,
                value: this.getDesiredAssetAllocationTypeText(DesiredAssetAllocationType.DoNotInclude)
            },
            {
                key: DesiredAssetAllocationType.SetByRiskProfile,
                value: this.getDesiredAssetAllocationTypeText(DesiredAssetAllocationType.SetByRiskProfile)
            }
        ];
        return options;
    }
}

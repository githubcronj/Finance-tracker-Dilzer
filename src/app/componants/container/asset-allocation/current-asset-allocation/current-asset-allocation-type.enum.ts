export enum CurrentAssetAllocationType {
    DoNotInclude = 0,
    SetByAssetClass = 1,
    
}

export class CurrentAssetAllocationTypeUtils {
    public static getCurrentAssetAllocationTypeText(assests) {
        switch (assests) {
            case CurrentAssetAllocationType.SetByAssetClass: return 'Set By Asset Class';
            case CurrentAssetAllocationType.DoNotInclude: return 'Do not include'
           
        }
    }


    public static getAllCurrentAssetAllocationType() {
        const options = [
            {
                key: CurrentAssetAllocationType.DoNotInclude,
                value: this.getCurrentAssetAllocationTypeText(CurrentAssetAllocationType.DoNotInclude)
            },
            {
                key: CurrentAssetAllocationType.SetByAssetClass,
                value: this.getCurrentAssetAllocationTypeText(CurrentAssetAllocationType.SetByAssetClass)
            }
        ];
        return options;
    }
}

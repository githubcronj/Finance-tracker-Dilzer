export enum GeneralHealthConditonStatus {
    VeryGood = 0,
    Normal = 1,
    BelowNormal = 2
}

export class GeneralHealthConditonUtils {
    public static getGeneralHealthConditonText(healthCondition) {
        switch (healthCondition) {
            case GeneralHealthConditonStatus.VeryGood: return 'Very Good';
            case GeneralHealthConditonStatus.Normal: return 'Normal';
            case GeneralHealthConditonStatus.BelowNormal: return 'Below Normal';
        }
    }

    public static getAllGeneralHealthConditonStatus() {
        const options = [
            {
                key: GeneralHealthConditonStatus.VeryGood,
                value: this.getGeneralHealthConditonText(GeneralHealthConditonStatus.VeryGood)
            },
            {
                key: GeneralHealthConditonStatus.Normal,
                value: this.getGeneralHealthConditonText(GeneralHealthConditonStatus.Normal)
            },
            {
                key: GeneralHealthConditonStatus.BelowNormal,
                value: this.getGeneralHealthConditonText(GeneralHealthConditonStatus.BelowNormal)
            }
        ];
        return options;
    }
}
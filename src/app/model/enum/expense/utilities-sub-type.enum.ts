export enum UtilityExpenseSubType {
    Electricity = 0,
    Water = 1,
    PhoneBills = 2,
    CableTV = 3,
    Gas = 4,
    CleaningAndMaintenance = 5,
    HouseRepairs = 6,
    InternetService = 7,
    Other = 8
}

export class UtilityExpenseSubtypeTypeUtils {
    public static getUtilityExpenseSubTypeText(expense) {
        switch (expense) {
            case UtilityExpenseSubType.Electricity: return 'Electricity';
            case UtilityExpenseSubType.Water: return 'Water';
            case UtilityExpenseSubType.PhoneBills: return 'Phone Bills';
            case UtilityExpenseSubType.CableTV: return 'Cable TV';
            case UtilityExpenseSubType.Gas: return 'Gas';
            case UtilityExpenseSubType.CleaningAndMaintenance: return 'Cleaning and Maintenance (Maids, Household)';
            case UtilityExpenseSubType.HouseRepairs: return 'House Repairs';
            case UtilityExpenseSubType.InternetService: return 'Internet Service';
            case UtilityExpenseSubType.Other: return 'Others';
        }
    }

    public static getAllUtilityExpenseSubType() {
        const options = [
            {
                key: UtilityExpenseSubType.Electricity,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.Electricity)
            },
            {
                key: UtilityExpenseSubType.Water,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.Water)
            },
            {
                key: UtilityExpenseSubType.PhoneBills,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.PhoneBills)
            },
            {
                key: UtilityExpenseSubType.CableTV,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.CableTV)
            },
            {
                key: UtilityExpenseSubType.Gas,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.Gas)
            },
            {
                key: UtilityExpenseSubType.CleaningAndMaintenance,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.CleaningAndMaintenance)
            },
            {
                key: UtilityExpenseSubType.HouseRepairs,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.HouseRepairs)
            },
            {
                key: UtilityExpenseSubType.InternetService,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.InternetService)
            },
            {
                key: UtilityExpenseSubType.Other,
                value: this.getUtilityExpenseSubTypeText(UtilityExpenseSubType.Other)
            }
        ];
        return options;
    }
}

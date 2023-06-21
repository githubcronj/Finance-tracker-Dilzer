export enum FixedExpenseType {
    HousingExpense = <any>'HousingExpense',
    UtilityExpense = <any>'UtilityExpense',
    PersonalExpense = <any>'PersonalExpense',
    FoodExpense = <any>'FoodExpense',
    HealthCareExpense = <any>'HealthCareExpense',
    FamilyCareExpense = <any>'FamilyCareExpense',
    TransportationExpense = <any>'TransportationExpense',
    
}

export class FixedExpenseTypeUtils {
    public static getFixedExpenseTypeText(expense) {
        switch (expense) {
            case FixedExpenseType.HousingExpense: return 'Housing';
            case FixedExpenseType.UtilityExpense: return 'Utilities';
            case FixedExpenseType.PersonalExpense: return 'Personal';
            case FixedExpenseType.FoodExpense: return 'Food';
            case FixedExpenseType.HealthCareExpense: return 'Health Care';
            case FixedExpenseType.FamilyCareExpense: return 'Family Care';
            case FixedExpenseType.TransportationExpense: return 'Transportation';
        }
    }

    public static getAllFixedExpenseType() {
        const options = [
            {
                key: FixedExpenseType.HousingExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.HousingExpense)
            },
            {
                key: FixedExpenseType.UtilityExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.UtilityExpense)
            },
            {
                key: FixedExpenseType.PersonalExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.PersonalExpense)
            },
            {
                key: FixedExpenseType.FoodExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.FoodExpense)
            },
            {
                key: FixedExpenseType.HealthCareExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.HealthCareExpense)
            },
            {
                key: FixedExpenseType.FamilyCareExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.FamilyCareExpense)
            },
            {
                key: FixedExpenseType.TransportationExpense,
                value: this.getFixedExpenseTypeText(FixedExpenseType.TransportationExpense)
            }
        ];
        return options;
    }
}
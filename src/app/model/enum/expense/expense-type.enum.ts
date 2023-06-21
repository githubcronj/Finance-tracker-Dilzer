export enum ExpenseType {
    HousingExpense = <any>'HousingExpense',
    UtilityExpense = <any>'UtilityExpense',
    PersonalExpense = <any>'PersonalExpense',
    FoodExpense = <any>'FoodExpense',
    HealthCareExpense = <any>'HealthCareExpense',
    FamilyCareExpense = <any>'FamilyCareExpense',
    TransportationExpense = <any>'TransportationExpense',
    RecreationExpense = <any>'RecreationExpense',
    MiscellaneousExpense = <any>'MiscellaneousExpense',
    PetExpense = <any>'PetExpense',
    OtherExpense = <any>'OtherExpense'
}

export class ExpenseTypeUtils {

    public static getColorCode(expenseType) {
        switch (expenseType) {
            case ExpenseType.HousingExpense: return '#C0392B';
            case ExpenseType.UtilityExpense: return '#AF7AC5';
            case ExpenseType.PersonalExpense: return '#5DADE2';
            case ExpenseType.FoodExpense: return '#76D7C4';
            case ExpenseType.HealthCareExpense: return '#52BE80';
            case ExpenseType.FamilyCareExpense: return '#F4D03F';
            case ExpenseType.TransportationExpense: return '#BA4A00';
            case ExpenseType.RecreationExpense: return '#626567';
            case ExpenseType.MiscellaneousExpense: return '#4A235A';
            case ExpenseType.PetExpense: return '#273746';
            case ExpenseType.OtherExpense: return '#1D8348';
        }
    }
    
    public static getExpenseTypeText(expense) {
        switch (expense) {
            case ExpenseType.HousingExpense: return 'Housing';
            case ExpenseType.UtilityExpense: return 'Utilities';
            case ExpenseType.PersonalExpense: return 'Personal';
            case ExpenseType.FoodExpense: return 'Food';
            case ExpenseType.HealthCareExpense: return 'Health Care';
            case ExpenseType.FamilyCareExpense: return 'Family Care';
            case ExpenseType.TransportationExpense: return 'Transportation';
            case ExpenseType.RecreationExpense: return 'Recreation and Entertainment';
            case ExpenseType.MiscellaneousExpense: return 'Miscellaneous';
            case ExpenseType.PetExpense: return 'Pet Expense';
            case ExpenseType.OtherExpense: return 'Others';
        }
    }

    public static getExpenseTypeImageName(assests) {
        switch (assests) {
            case ExpenseType.HousingExpense: return  'housing_expense_icon.png';
            case ExpenseType.UtilityExpense: return 'utilities_expense_icon.png';
            case ExpenseType.PersonalExpense: return 'personal_expense_icon.png';
            case ExpenseType.FoodExpense: return 'food_expense_icon.png';
            case ExpenseType.HealthCareExpense: return 'healthcare_expense_icon.png';
            case ExpenseType.FamilyCareExpense: return 'familycare_expense_icon.png';
            case ExpenseType.TransportationExpense: return 'transportation_expense_icon.png';
            case ExpenseType.RecreationExpense: return 'recreation_expense_icon.png';
            case ExpenseType.MiscellaneousExpense: return 'miscellaneous_expense_icon.png';
            case ExpenseType.PetExpense: return 'pet_expense_icon.png';
            case ExpenseType.OtherExpense: return 'other_expense_icon.png';

        }
    }

    public static getAllExpenseType() {
        const options = [
            {
                key: ExpenseType.HousingExpense,
                value: this.getExpenseTypeText(ExpenseType.HousingExpense),
                image: this.getExpenseTypeImageName(ExpenseType.HousingExpense)
            },
            {
                key: ExpenseType.UtilityExpense,
                value: this.getExpenseTypeText(ExpenseType.UtilityExpense),
                image: this.getExpenseTypeImageName(ExpenseType.UtilityExpense)
            },
            {
                key: ExpenseType.PersonalExpense,
                value: this.getExpenseTypeText(ExpenseType.PersonalExpense),
                image: this.getExpenseTypeImageName(ExpenseType.PersonalExpense)
            },
            {
                key: ExpenseType.FoodExpense,
                value: this.getExpenseTypeText(ExpenseType.FoodExpense),
                image: this.getExpenseTypeImageName(ExpenseType.FoodExpense)
            },
            {
                key: ExpenseType.HealthCareExpense,
                value: this.getExpenseTypeText(ExpenseType.HealthCareExpense),
                image: this.getExpenseTypeImageName(ExpenseType.HealthCareExpense)
            },
            {
                key: ExpenseType.FamilyCareExpense,
                value: this.getExpenseTypeText(ExpenseType.FamilyCareExpense),
                image: this.getExpenseTypeImageName(ExpenseType.FamilyCareExpense)
            },
            {
                key: ExpenseType.TransportationExpense,
                value: this.getExpenseTypeText(ExpenseType.TransportationExpense),
                image: this.getExpenseTypeImageName(ExpenseType.TransportationExpense)
            },
            {
                key: ExpenseType.RecreationExpense,
                value: this.getExpenseTypeText(ExpenseType.RecreationExpense),
                image: this.getExpenseTypeImageName(ExpenseType.RecreationExpense)
            },
            {
                key: ExpenseType.MiscellaneousExpense,
                value: this.getExpenseTypeText(ExpenseType.MiscellaneousExpense),
                image: this.getExpenseTypeImageName(ExpenseType.MiscellaneousExpense)
            },
            {
                key: ExpenseType.PetExpense,
                value: this.getExpenseTypeText(ExpenseType.PetExpense),
                image: this.getExpenseTypeImageName(ExpenseType.PetExpense)
            },
            {
                key: ExpenseType.OtherExpense,
                value: this.getExpenseTypeText(ExpenseType.OtherExpense),
                image: this.getExpenseTypeImageName(ExpenseType.OtherExpense)
            }
        ];
        return options;
    }
}
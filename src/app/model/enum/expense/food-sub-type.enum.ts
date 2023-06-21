export enum FoodExpenseSubType {
    Grocery = 0,
    EatingOut = 1,
    Other = 2
}

export class FoodExpenseSubtypeTypeUtils {
    public static getFoodExpenseSubTypeText(expense) {
        switch (expense) {
            case FoodExpenseSubType.Grocery: return 'Grocery';
            case FoodExpenseSubType.EatingOut: return 'Eating Out(Essential)';
            case FoodExpenseSubType.Other: return 'Others';
        }
    }

    public static getAllFoodExpenseSubType() {
        const options = [
            {
                key: FoodExpenseSubType.Grocery,
                value: this.getFoodExpenseSubTypeText(FoodExpenseSubType.Grocery)
            },
            {
                key: FoodExpenseSubType.EatingOut,
                value: this.getFoodExpenseSubTypeText(FoodExpenseSubType.EatingOut)
            },
            {
                key: FoodExpenseSubType.Other,
                value: this.getFoodExpenseSubTypeText(FoodExpenseSubType.Other)
            }
        ];
        return options;
    }
}

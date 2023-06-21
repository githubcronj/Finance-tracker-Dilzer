export enum TypeOfExpense {
    EarlyRetirementExpense = 0,
    LateRetirementExpense = 1
}

export class TypeOfExpenseUtils {
    public static getTypeOfExpenseText(type) {
        switch (type) {
            case TypeOfExpense.EarlyRetirementExpense: return 'Early Retirement Expense';
            case TypeOfExpense.LateRetirementExpense: return 'Late Retirement Expense';            
        }
    }


    public static getAllTypeOfExpense() {
        const options = [
            {
                key: TypeOfExpense.EarlyRetirementExpense,
                value: this.getTypeOfExpenseText(TypeOfExpense.EarlyRetirementExpense)
            },
            {
                key: TypeOfExpense.LateRetirementExpense,
                value: this.getTypeOfExpenseText(TypeOfExpense.LateRetirementExpense)
            }
        ];
        return options;
    }
}
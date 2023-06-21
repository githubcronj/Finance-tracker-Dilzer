export enum ExpenseCategoryType {
    Fixed = 0,
    Discretionary = 1
}


export class ExpenseCategoryTypeUtils {
    public static getExpenseCategoryTypeText(expenseCategoryType) {
        switch (expenseCategoryType) {
            case ExpenseCategoryType.Fixed: return 'Fixed';
            case ExpenseCategoryType.Discretionary: return 'Discretionary';
        }
    }

    public static getAllExpenseCategoryType() {
        const options = [
            {
                key: ExpenseCategoryType.Fixed,
                value: this.getExpenseCategoryTypeText(ExpenseCategoryType.Fixed)
            },
            {
                key: ExpenseCategoryType.Discretionary,
                value: this.getExpenseCategoryTypeText(ExpenseCategoryType.Discretionary)
            }
        ];
        return options;
    }
}

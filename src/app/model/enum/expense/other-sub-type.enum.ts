export enum OtherExpenseSubType {
    Other = 0
}

export class OtherExpenseSubTypeUtils {
    public static getOtherSubTypeText(expense) {
        switch (expense) {
            case OtherExpenseSubType.Other: return 'Other';
        }
    }

    public static getAllOtherExpensesSubType() {
        const options = [
            {
                key: OtherExpenseSubType.Other,
                value: this.getOtherSubTypeText(OtherExpenseSubType.Other)
            }
        ];
        return options;
    }
}

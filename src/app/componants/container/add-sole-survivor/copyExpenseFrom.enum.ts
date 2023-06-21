export enum CopyExpenseFromType {
    RetirementLivingExpenses = 0,
    CurrentLivingExpenses = 1,
    LateRetirementLivingExpenses = 2
    

}

export class CopyExpenseFromTypeUtils {
    public static getCopyExpenseFromTypeText(type) {
        switch (type) {
            case CopyExpenseFromType.RetirementLivingExpenses: return 'Early Retirement Living Expenses';
            case CopyExpenseFromType.CurrentLivingExpenses: return 'Current Living Expenses';
            case CopyExpenseFromType.LateRetirementLivingExpenses: return 'Late Current Living Expenses';

        }
    }


    public static getAllCopyExpenseFromType() {
        const options = [
            {
                key: CopyExpenseFromType.RetirementLivingExpenses,
                value: this.getCopyExpenseFromTypeText(CopyExpenseFromType.RetirementLivingExpenses)
            },
            {
                key: CopyExpenseFromType.CurrentLivingExpenses,
                value: this.getCopyExpenseFromTypeText(CopyExpenseFromType.CurrentLivingExpenses)
            },
            {
                key: CopyExpenseFromType.LateRetirementLivingExpenses,
                value: this.getCopyExpenseFromTypeText(CopyExpenseFromType.LateRetirementLivingExpenses)
            }
        ];
        return options;
    }
}
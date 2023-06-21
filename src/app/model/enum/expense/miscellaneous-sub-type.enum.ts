export enum MiscellaneousExpenseSubType {
    CharitableContributions = 0,
    LegalExpenses = 1,
    InvestmentExpenses  = 2,
    Gifts = 3,
    Other = 4
}

export class MiscellaneousExpenseSubTypeTypeUtils {
    public static getMiscellaneousExpenseSubTypeText(expense) {
        switch (expense) {
            case MiscellaneousExpenseSubType.CharitableContributions: return 'Charitable Contributions';
            case MiscellaneousExpenseSubType.LegalExpenses: return 'Legal Expenses';
            case MiscellaneousExpenseSubType.InvestmentExpenses: return 'Investment Expenses (Financial Advisor fees etc)';
            case MiscellaneousExpenseSubType.Gifts: return 'Gifts';
            case MiscellaneousExpenseSubType.Other: return 'Miscellaneous Other';
        }
    }

    public static getAllMiscellaneousExpenseSubType() {
        const options = [
            {
                key: MiscellaneousExpenseSubType.CharitableContributions,
                value: this.getMiscellaneousExpenseSubTypeText(MiscellaneousExpenseSubType.CharitableContributions)
            },
            {
                key: MiscellaneousExpenseSubType.LegalExpenses,
                value: this.getMiscellaneousExpenseSubTypeText(MiscellaneousExpenseSubType.LegalExpenses)
            },
            {
                key: MiscellaneousExpenseSubType.InvestmentExpenses,
                value: this.getMiscellaneousExpenseSubTypeText(MiscellaneousExpenseSubType.InvestmentExpenses)
            },
            {
                key: MiscellaneousExpenseSubType.Gifts,
                value: this.getMiscellaneousExpenseSubTypeText(MiscellaneousExpenseSubType.Gifts)
            },
            {
                key: MiscellaneousExpenseSubType.Other,
                value: this.getMiscellaneousExpenseSubTypeText(MiscellaneousExpenseSubType.Other)
            }
        ];
        return options;
    }
}

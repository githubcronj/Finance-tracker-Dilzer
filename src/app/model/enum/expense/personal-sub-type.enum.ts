export enum PersonalExpenseSubType {
    LaundryExpenses = 0,
    NewClothing = 1,
    Travel = 2,
    CreditCardPayments = 3,
    Other = 4
}

export class PersonalExpenseSubtypeTypeUtils {
    public static getPersonalExpenseSubTypeText(expense) {
        switch (expense) {
            case PersonalExpenseSubType.LaundryExpenses: return 'Laundry Expenses';
            case PersonalExpenseSubType.NewClothing: return 'New Clothing(Shopping expenses)';
            case PersonalExpenseSubType.Travel: return 'Travel (Visit to Family or other- annual travel)';
            case PersonalExpenseSubType.CreditCardPayments: return 'Credit Card Payments';
            case PersonalExpenseSubType.Other: return 'Others';
        }
    }

    public static getAllPersonalExpenseSubType() {
        const options = [
            {
                key: PersonalExpenseSubType.LaundryExpenses,
                value: this.getPersonalExpenseSubTypeText(PersonalExpenseSubType.LaundryExpenses)
            },
            {
                key: PersonalExpenseSubType.NewClothing,
                value: this.getPersonalExpenseSubTypeText(PersonalExpenseSubType.NewClothing)
            },
            {
                key: PersonalExpenseSubType.Travel,
                value: this.getPersonalExpenseSubTypeText(PersonalExpenseSubType.Travel)
            },
            {
                key: PersonalExpenseSubType.CreditCardPayments,
                value: this.getPersonalExpenseSubTypeText(PersonalExpenseSubType.CreditCardPayments)
            },
            {
                key: PersonalExpenseSubType.Other,
                value: this.getPersonalExpenseSubTypeText(PersonalExpenseSubType.Other)
            }
        ];
        return options;
    }
}

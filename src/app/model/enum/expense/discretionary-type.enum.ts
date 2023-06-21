export enum DiscretionaryExpenseType {
    RecreationExpense = <any>'RecreationExpense',
    MiscellaneousExpense = <any>'MiscellaneousExpense',
    PetExpense = <any>'PetExpense',
    OtherExpense = <any>'OtherExpense'
}

export class DiscretionaryExpenseTypeUtils {
    public static getDiscretionaryExpenseTypeText(expense) {
        switch (expense) {
            case DiscretionaryExpenseType.RecreationExpense: return 'Recreation and Entertainment';
            case DiscretionaryExpenseType.MiscellaneousExpense: return 'Miscellaneous';
            case DiscretionaryExpenseType.PetExpense: return 'Pet Expenses';
            case DiscretionaryExpenseType.OtherExpense: return 'Other Expenses';
        }
    }

    public static getAllDiscretionaryExpenseType() {
        const options = [
            {
                key: DiscretionaryExpenseType.RecreationExpense,
                value: this.getDiscretionaryExpenseTypeText(DiscretionaryExpenseType.RecreationExpense)
            },
            {
                key: DiscretionaryExpenseType.MiscellaneousExpense,
                value: this.getDiscretionaryExpenseTypeText(DiscretionaryExpenseType.MiscellaneousExpense)
            },
            {
                key: DiscretionaryExpenseType.PetExpense,
                value: this.getDiscretionaryExpenseTypeText(DiscretionaryExpenseType.PetExpense)
            },
            {
                key: DiscretionaryExpenseType.OtherExpense,
                value: this.getDiscretionaryExpenseTypeText(DiscretionaryExpenseType.OtherExpense)
            }
        ];
        return options;
    }
}
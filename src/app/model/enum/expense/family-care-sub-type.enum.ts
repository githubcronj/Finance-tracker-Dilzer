export enum FamilyCareExpenseSubType {
    ChildEducation = 0,
    ChildExtraCurricularActivity = 1,
    ChildCare = 2,
    SupportOfParent = 3,
    Other = 4
}


export class FamilyCareExpenseSubTypeUtils {
    public static getFamilyCareExpenseSubTypeText(expense) {
        switch (expense) {
            case FamilyCareExpenseSubType.ChildEducation: return 'Child Education(Upto 12th grade)(School Fees/ Tuitions)';
            case FamilyCareExpenseSubType.ChildExtraCurricularActivity: return "Child's extra curricular activity Expenses (Dance class etc)";
            case FamilyCareExpenseSubType.ChildCare: return "Child Care(Day care expenses, if any)";
            case FamilyCareExpenseSubType.SupportOfParent: return "Support of Parent or Child";
            case FamilyCareExpenseSubType.Other: return 'Family Care Other';
        }
    }

    public static getAllFamilyCareExpenseSubType() {
        const options = [
            {
                key: FamilyCareExpenseSubType.ChildEducation,
                value: this.getFamilyCareExpenseSubTypeText(FamilyCareExpenseSubType.ChildEducation)
            },
            {
                key: FamilyCareExpenseSubType.ChildExtraCurricularActivity,
                value: this.getFamilyCareExpenseSubTypeText(FamilyCareExpenseSubType.ChildExtraCurricularActivity)
            },
            {
                key: FamilyCareExpenseSubType.ChildCare,
                value: this.getFamilyCareExpenseSubTypeText(FamilyCareExpenseSubType.ChildCare)
            },
            {
                key: FamilyCareExpenseSubType.SupportOfParent,
                value: this.getFamilyCareExpenseSubTypeText(FamilyCareExpenseSubType.SupportOfParent)
            },
            {
                key: FamilyCareExpenseSubType.Other,
                value: this.getFamilyCareExpenseSubTypeText(FamilyCareExpenseSubType.Other)
            }
        ];
        return options;
    }
}

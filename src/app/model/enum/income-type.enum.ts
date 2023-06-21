export enum IncomeType {
    BusinessIncome = <any>'BusinessIncome',
    DividendIncome = <any>'DividendIncome',
    GovernmentPensionIncome = <any>'GovernmentPensionIncome',
    InterestIncome = <any>'InterestIncome',
    MoneyBackPolicyPayoutIncome = <any>'MoneyBackPolicyPayoutIncome',
    NetSalaryIncome = <any>'NetSalaryIncome',
    PensionIncome = <any>'PensionIncome',
    ProfessionalIncome = <any>'ProfessionalIncome',
    RentalIncome = <any>'RentalIncome',
    SuperannuationIncome = <any>'SuperannuationIncome',
    VariableIncome = <any>'VariableIncome',
    OtherIncome = <any>'OtherIncome'

}

export class IncomeTypeUtils {
    public static getColorCode(incomeType) {
        switch (incomeType) {
            case IncomeType.BusinessIncome: return '#C0392B';
            case IncomeType.DividendIncome: return '#AF7AC5';
            case IncomeType.GovernmentPensionIncome: return '#5DADE2';
            case IncomeType.InterestIncome: return '#76D7C4';
            case IncomeType.MoneyBackPolicyPayoutIncome: return '#52BE80';
            case IncomeType.NetSalaryIncome: return '#F4D03F';
            case IncomeType.PensionIncome: return '#BA4A00';
            case IncomeType.ProfessionalIncome: return '#626567';
            case IncomeType.RentalIncome: return '#4A235A';
            case IncomeType.SuperannuationIncome: return '#273746';
            case IncomeType.VariableIncome: return '#1D8348';
            case IncomeType.OtherIncome: return '#FFA07A';

        }
    }

    public static getIncomeTypeText(income) {
        switch (income) {
            case IncomeType.BusinessIncome: return 'Business Income';
            case IncomeType.DividendIncome: return 'Dividend Income';
            case IncomeType.GovernmentPensionIncome: return 'Government Pension Income';
            case IncomeType.InterestIncome: return 'Interest Income';
            case IncomeType.MoneyBackPolicyPayoutIncome: return 'Moneyback Policy Payout Income';
            case IncomeType.NetSalaryIncome: return 'Net Salary Income';
            case IncomeType.PensionIncome: return 'Pension Income';
            case IncomeType.ProfessionalIncome: return 'Professional Income';
            case IncomeType.RentalIncome: return 'Rental Income';
            case IncomeType.SuperannuationIncome: return 'Superannuation Income';
            case IncomeType.VariableIncome: return 'Variable Income';
            case IncomeType.OtherIncome: return 'Other Income';

        }
    }

    public static getIncomeTypeImageName(assests) {
        switch (assests) {
            case IncomeType.BusinessIncome: return  'business_income.png';
            case IncomeType.DividendIncome: return 'dividend_income_icon.png';
            case IncomeType.GovernmentPensionIncome: return 'government_pension_income.png';
            case IncomeType.InterestIncome: return 'interest_income_icon.png';
            case IncomeType.MoneyBackPolicyPayoutIncome: return 'moneyback_policy_payout_income_icon.png';
            case IncomeType.NetSalaryIncome: return 'net_salary_income_icon.png';
            case IncomeType.PensionIncome: return 'pension_income.png';
            case IncomeType.ProfessionalIncome: return 'professional_income_icon.png';
            case IncomeType.RentalIncome: return 'rental_income.png';
            case IncomeType.SuperannuationIncome: return 'superannuation_icon.png';
            case IncomeType.VariableIncome: return 'variable_income_icon.png';
            case IncomeType.OtherIncome: return 'other_income_icon.png';

        }
    }

    public static getAllIncomeType() {
        const options = [
            {
                key: IncomeType.BusinessIncome,
                value: this.getIncomeTypeText(IncomeType.BusinessIncome),
                image: this.getIncomeTypeImageName(IncomeType.BusinessIncome)
            },
            {
                key: IncomeType.DividendIncome,
                value: this.getIncomeTypeText(IncomeType.DividendIncome),
                image: this.getIncomeTypeImageName(IncomeType.DividendIncome)
            },
            {
                key: IncomeType.GovernmentPensionIncome,
                value: this.getIncomeTypeText(IncomeType.GovernmentPensionIncome),
                image: this.getIncomeTypeImageName(IncomeType.GovernmentPensionIncome)
            },
            {
                key: IncomeType.InterestIncome,
                value: this.getIncomeTypeText(IncomeType.InterestIncome),
                image: this.getIncomeTypeImageName(IncomeType.InterestIncome)
            },
            {
                key: IncomeType.MoneyBackPolicyPayoutIncome,
                value: this.getIncomeTypeText(IncomeType.MoneyBackPolicyPayoutIncome),
                image: this.getIncomeTypeImageName(IncomeType.MoneyBackPolicyPayoutIncome)
            },
            {
                key: IncomeType.NetSalaryIncome,
                value: this.getIncomeTypeText(IncomeType.NetSalaryIncome),
                image: this.getIncomeTypeImageName(IncomeType.NetSalaryIncome)
            },
            {
                key: IncomeType.PensionIncome,
                value: this.getIncomeTypeText(IncomeType.PensionIncome),
                image: this.getIncomeTypeImageName(IncomeType.PensionIncome)
            },
            {
                key: IncomeType.ProfessionalIncome,
                value: this.getIncomeTypeText(IncomeType.ProfessionalIncome),
                image: this.getIncomeTypeImageName(IncomeType.ProfessionalIncome)
            },
            {
                key: IncomeType.RentalIncome,
                value: this.getIncomeTypeText(IncomeType.RentalIncome),
                image: this.getIncomeTypeImageName(IncomeType.RentalIncome)
            },
            {
                key: IncomeType.SuperannuationIncome,
                value: this.getIncomeTypeText(IncomeType.SuperannuationIncome),
                image: this.getIncomeTypeImageName(IncomeType.SuperannuationIncome)
            },
            {
                key: IncomeType.VariableIncome,
                value: this.getIncomeTypeText(IncomeType.VariableIncome),
                image: this.getIncomeTypeImageName(IncomeType.VariableIncome)
            },
            {
                key: IncomeType.OtherIncome,
                value: this.getIncomeTypeText(IncomeType.OtherIncome),
                image: this.getIncomeTypeImageName(IncomeType.OtherIncome)
            }
        ];
        return options;
    }
}
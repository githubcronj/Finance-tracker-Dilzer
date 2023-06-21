export enum LiabilityType {
    CarLoan = <any>'CarLoan',
    CreditCardLoan = <any>'CreditCardLoan',
    GoldLoan = <any>'GoldLoan',
    HousingLoan = <any>'HousingLoan',
    MortgageLoan = <any>'MortgageLoan',
    PersonalLoan = <any>'PersonalLoan',
    OtherLoan = <any>'OtherLoan'
}

export class LiabilityTypeUtils {
    public static getColorCode(liabilityType) {
        switch (liabilityType) {
            case LiabilityType.CarLoan: return '#C0392B';
            case LiabilityType.CreditCardLoan: return '#AF7AC5';
            case LiabilityType.GoldLoan: return '#5DADE2';
            case LiabilityType.HousingLoan: return '#76D7C4';
            case LiabilityType.MortgageLoan: return '#52BE80';
            case LiabilityType.PersonalLoan: return '#F4D03F';
            case LiabilityType.OtherLoan: return '#BA4A00';
        }
    }

    public static getLiabilityTypeText(liability) {
        switch (liability) {
            case LiabilityType.CarLoan: return 'Car Loan';
            case LiabilityType.CreditCardLoan: return 'Credit Card Loan';
            case LiabilityType.GoldLoan: return 'Gold Loan';
            case LiabilityType.HousingLoan: return 'Housing Loan';
            case LiabilityType.MortgageLoan: return 'Mortgage Loan';
            case LiabilityType.PersonalLoan: return 'Personal Loan';
            case LiabilityType.OtherLoan: return 'Other Loan';

        }
    }

    public static getLiabilityKindName(asset) {
        switch (asset) {
            case 'Car Loan': return LiabilityType.CarLoan;
            case 'Credit Card Loan': return LiabilityType.CreditCardLoan;
            case 'Gold Loan': return LiabilityType.GoldLoan;
            case 'Housing Loan': return LiabilityType.HousingLoan;
            case 'Mortgage Loan': return LiabilityType.MortgageLoan;
            case 'Personal Loan': return LiabilityType.PersonalLoan;
            case 'Other Loan': return LiabilityType.OtherLoan;
        }
    }

    public static getLiabilityTypeImageName(liability) {
        switch (liability) {
            case LiabilityType.CarLoan: return 'car_loan_icon.png';
            case LiabilityType.CreditCardLoan: return 'credit_card_loan_icon.png';
            case LiabilityType.GoldLoan: return 'gold_loan_icon.png';
            case LiabilityType.HousingLoan: return 'housing_loan_icon.png';
            case LiabilityType.MortgageLoan: return 'mortgage_loan_icon.png';
            case LiabilityType.PersonalLoan: return 'personal_loan_icon.png';
            case LiabilityType.OtherLoan: return 'other_loan_icon.png';

        }
    }

    public static getAllLiabilityType() {
        const options = [
            {
                key: LiabilityType.CarLoan,
                value: this.getLiabilityTypeText(LiabilityType.CarLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.CarLoan)

            },
            {
                key: LiabilityType.CreditCardLoan,
                value: this.getLiabilityTypeText(LiabilityType.CreditCardLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.CreditCardLoan)

            },
            {
                key: LiabilityType.GoldLoan,
                value: this.getLiabilityTypeText(LiabilityType.GoldLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.GoldLoan)

            },
            {
                key: LiabilityType.HousingLoan,
                value: this.getLiabilityTypeText(LiabilityType.HousingLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.HousingLoan)

            },
            {
                key: LiabilityType.MortgageLoan,
                value: this.getLiabilityTypeText(LiabilityType.MortgageLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.MortgageLoan)

            },
            {
                key: LiabilityType.PersonalLoan,
                value: this.getLiabilityTypeText(LiabilityType.PersonalLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.PersonalLoan)

            },
            {
                key: LiabilityType.OtherLoan,
                value: this.getLiabilityTypeText(LiabilityType.OtherLoan),
                image: this.getLiabilityTypeImageName(LiabilityType.OtherLoan)

            }
        ];
        return options;
    }
}


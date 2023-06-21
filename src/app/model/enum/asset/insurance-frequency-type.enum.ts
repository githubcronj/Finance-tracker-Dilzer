export enum InsuranceFrequencyType {
    Yearly = 0,
    HalfYearly = 1,
    Quarterly = 2,
    Monthly = 3

}

export class InsuranceFrequencyTypeUtils {
    public static getInsuranceFrequencyTypeText(assests) {
        switch (assests) {
            case InsuranceFrequencyType.Yearly: return 'Yearly';
            case InsuranceFrequencyType.HalfYearly: return 'Half Yearly';
            case InsuranceFrequencyType.Quarterly: return 'Quarterly';
            case InsuranceFrequencyType.Monthly: return 'Monthly';
        }
    }


    public static getAllInsuranceFrequencyType() {
        const options = [
            {
                key: InsuranceFrequencyType.Yearly,
                value: this.getInsuranceFrequencyTypeText(InsuranceFrequencyType.Yearly)
            },
            {
                key: InsuranceFrequencyType.HalfYearly,
                value: this.getInsuranceFrequencyTypeText(InsuranceFrequencyType.HalfYearly)
            },
            {
                key: InsuranceFrequencyType.Quarterly,
                value: this.getInsuranceFrequencyTypeText(InsuranceFrequencyType.Quarterly)
            },
            {
                key: InsuranceFrequencyType.Monthly,
                value: this.getInsuranceFrequencyTypeText(InsuranceFrequencyType.Monthly)
            }
        ];
        return options;
    }
}

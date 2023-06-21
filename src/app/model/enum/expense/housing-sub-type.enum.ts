export enum HousingExpenseSubType {
    ApartmentMaintenanceCharges = 0,
    PropertyTax = 1,
    RentAndCondoFees = 2,
    HomeInsurance = 3,
    PropertyManagement = 4,
    Other = 5
}

export class HousingExpenseSubtypeTypeUtils {
    public static getHousingExpenseSubTypeText(expense) {
        switch (expense) {
            case HousingExpenseSubType.ApartmentMaintenanceCharges: return 'Apartment Maintenance Charges';
            case HousingExpenseSubType.PropertyTax: return 'Property Tax';
            case HousingExpenseSubType.RentAndCondoFees: return 'Rent and Condo Fees';
            case HousingExpenseSubType.HomeInsurance: return 'Home Insurance';
            case HousingExpenseSubType.PropertyManagement: return 'Property Management';
            case HousingExpenseSubType.Other: return 'Other';
        }
    }

    public static getAllHousingExpenseSubType() {
        const options = [
            {
                key: HousingExpenseSubType.ApartmentMaintenanceCharges,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.ApartmentMaintenanceCharges)
            },
            {
                key: HousingExpenseSubType.PropertyTax,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.PropertyTax)
            },
            {
                key: HousingExpenseSubType.RentAndCondoFees,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.RentAndCondoFees)
            },
            {
                key: HousingExpenseSubType.HomeInsurance,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.HomeInsurance)
            },
            {
                key: HousingExpenseSubType.PropertyManagement,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.PropertyManagement)
            },
            {
                key: HousingExpenseSubType.Other,
                value: this.getHousingExpenseSubTypeText(HousingExpenseSubType.Other)
            }
        ];
        return options;
    }
}

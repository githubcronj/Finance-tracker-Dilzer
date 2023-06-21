export enum TransportationExpenseSubType {
    VehicleMaintenanceAndRepair = 0,
    AutoLoanOrLeasePayment = 1,
    PetrolOrDiesel = 2,
    AutoInsurancePremium = 3,
    Other = 4
}

export class TransportationExpenseSubTypeUtils {
    public static getTransportationExpenseSubTypeText(expense) {
        switch (expense) {
            case TransportationExpenseSubType.VehicleMaintenanceAndRepair: return 'Vehicle Maintenance and Repair';
            case TransportationExpenseSubType.AutoLoanOrLeasePayment: return 'Auto Loan or Lease Payment';
            case TransportationExpenseSubType.PetrolOrDiesel: return 'Petrol/Diesel';
            case TransportationExpenseSubType.AutoInsurancePremium: return 'Auto Insurance Premium';
            case TransportationExpenseSubType.Other: return 'Transportation Other(Commuting exp etc)';
        }
    }

    public static getAllTransportationExpenseSubType() {
        const options = [
            {
                key: TransportationExpenseSubType.VehicleMaintenanceAndRepair,
                value: this.getTransportationExpenseSubTypeText(TransportationExpenseSubType.VehicleMaintenanceAndRepair)
            },
            {
                key: TransportationExpenseSubType.AutoLoanOrLeasePayment,
                value: this.getTransportationExpenseSubTypeText(TransportationExpenseSubType.AutoLoanOrLeasePayment)
            },
            {
                key: TransportationExpenseSubType.PetrolOrDiesel,
                value: this.getTransportationExpenseSubTypeText(TransportationExpenseSubType.PetrolOrDiesel)
            },
            {
                key: TransportationExpenseSubType.AutoInsurancePremium,
                value: this.getTransportationExpenseSubTypeText(TransportationExpenseSubType.AutoInsurancePremium)
            },
            {
                key: TransportationExpenseSubType.Other,
                value: this.getTransportationExpenseSubTypeText(TransportationExpenseSubType.Other)
            }
        ];
        return options;
    }
}

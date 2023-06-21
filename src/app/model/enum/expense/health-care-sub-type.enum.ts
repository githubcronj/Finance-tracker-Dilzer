export enum HealthCareExpenseSubType {
    Medicines = 0,
    Doctor = 1,
    EyeCare = 2,
    Dentist = 3,
    Hospitalization = 4,
    RegularHealthInsurancePremiums = 5,
    OtherHealthInsurancePremiums = 6,
    Other = 7
}

export class HealthCareExpenseSubtypeTypeUtils {
    public static getHealthCareExpenseSubTypeText(expense) {
        switch (expense) {
            case HealthCareExpenseSubType.Medicines: return 'Medicines';
            case HealthCareExpenseSubType.Doctor: return 'Doctor/Specialist';
            case HealthCareExpenseSubType.EyeCare: return 'Eye-Care';
            case HealthCareExpenseSubType.Dentist: return 'Dentist';
            case HealthCareExpenseSubType.Hospitalization: return 'Hospitalization';
            case HealthCareExpenseSubType.RegularHealthInsurancePremiums: return 'Regular Health Insurance Premiums';
            case HealthCareExpenseSubType.OtherHealthInsurancePremiums: return 'Other Health Ins. Premiums (Critical Illness Ins./ Accidental Disability Ins.)';
            case HealthCareExpenseSubType.Other: return 'Others';
        }
    }

    public static getAllHealthCareExpenseSubType() {
        const options = [
            {
                key: HealthCareExpenseSubType.Medicines,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.Medicines)
            },
            {
                key: HealthCareExpenseSubType.Doctor,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.Doctor)
            },
            {
                key: HealthCareExpenseSubType.EyeCare,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.EyeCare)
            },
            {
                key: HealthCareExpenseSubType.Dentist,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.Dentist)
            },
            {
                key: HealthCareExpenseSubType.Hospitalization,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.Hospitalization)
            },
            {
                key: HealthCareExpenseSubType.RegularHealthInsurancePremiums,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.RegularHealthInsurancePremiums)
            },
            {
                key: HealthCareExpenseSubType.OtherHealthInsurancePremiums,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.OtherHealthInsurancePremiums)
            },
            {
                key: HealthCareExpenseSubType.Other,
                value: this.getHealthCareExpenseSubTypeText(HealthCareExpenseSubType.Other)
            }
        ];
        return options;
    }
}

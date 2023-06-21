export enum PetExpenseSubType {
    Medicines = 0,
    MedicalCheckUp = 1,
    Food = 2,
    Accessories = 3,
    Other = 4
}

export class PetExpenseSubTypeTypeUtils {
    public static getPetExpenseSubTypeText(expense) {
        switch (expense) {
            case PetExpenseSubType.Medicines: return 'Medicines';
            case PetExpenseSubType.MedicalCheckUp: return 'Medical check up / Vet consultation';
            case PetExpenseSubType.Food: return 'Food';
            case PetExpenseSubType.Accessories: return 'Accessories';
            case PetExpenseSubType.Other: return 'Others';
        }
    }

    public static getAllPetExpenseSubType() {
        const options = [
            {
                key: PetExpenseSubType.Medicines,
                value: this.getPetExpenseSubTypeText(PetExpenseSubType.Medicines)
            },
            {
                key: PetExpenseSubType.MedicalCheckUp,
                value: this.getPetExpenseSubTypeText(PetExpenseSubType.MedicalCheckUp)
            },
            {
                key: PetExpenseSubType.Food,
                value: this.getPetExpenseSubTypeText(PetExpenseSubType.Food)
            },
            {
                key: PetExpenseSubType.Accessories,
                value: this.getPetExpenseSubTypeText(PetExpenseSubType.Accessories)
            },
            {
                key: PetExpenseSubType.Other,
                value: this.getPetExpenseSubTypeText(PetExpenseSubType.Other)
            }
        ];
        return options;
    }
}

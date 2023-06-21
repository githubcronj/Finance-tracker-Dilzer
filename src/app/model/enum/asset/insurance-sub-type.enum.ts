export enum InsuranceAssetSubType {
    Term = <any>'Term',
    Endowment = <any>'Endowment',
    WholeLife = <any>'WholeLife',
    Moneyback = <any>'Moneyback',
    ULIP = <any>'ULIP',
    PensionPlans = <any>'PensionPlans',
    SuperAnnuation = <any>'Superannuation',
    Motor = <any>'Motor',
    Health = <any>'Health',
    CriticalIllness = <any>'CriticalIllness',
    PersonalAccident = <any>'PersonalAccident',
    Property = <any>'Property',
    Other = <any>'Other'
}


export class InsuranceAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case InsuranceAssetSubType.Term: return 'Term';
            case InsuranceAssetSubType.Endowment: return 'Endowment';
            case InsuranceAssetSubType.WholeLife: return 'Whole Life';
            case InsuranceAssetSubType.Moneyback: return 'Moneyback';
            case InsuranceAssetSubType.ULIP: return 'ULIP';
            case InsuranceAssetSubType.PensionPlans: return 'Pension Plans';
            case InsuranceAssetSubType.SuperAnnuation: return 'Superannuation';
            case InsuranceAssetSubType.Motor: return 'Motor';
            case InsuranceAssetSubType.Health: return 'Health';
            case InsuranceAssetSubType.CriticalIllness: return 'Critical Illness';
            case InsuranceAssetSubType.PersonalAccident: return 'Personal Accident';
            case InsuranceAssetSubType.Property: return 'Property';
            case InsuranceAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: InsuranceAssetSubType.Term,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Term)
            },
            {
                key: InsuranceAssetSubType.Endowment,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Endowment)
            },
            {
                key: InsuranceAssetSubType.WholeLife,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.WholeLife)
            },
            {
                key: InsuranceAssetSubType.Moneyback,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Moneyback)
            },
            {
                key: InsuranceAssetSubType.ULIP,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.ULIP)
            },
            {
                key: InsuranceAssetSubType.PensionPlans,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.PensionPlans)
            },
            {
                key: InsuranceAssetSubType.SuperAnnuation,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.SuperAnnuation)
            },
            {
                key: InsuranceAssetSubType.Motor,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Motor)
            },
            {
                key: InsuranceAssetSubType.Health,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Health)
            },
            {
                key: InsuranceAssetSubType.CriticalIllness,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.CriticalIllness)
            },
            {
                key: InsuranceAssetSubType.PersonalAccident,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.PersonalAccident)
            },
            {
                key: InsuranceAssetSubType.Property,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Property)
            },
            {
                key: InsuranceAssetSubType.Other,
                value: this.getAssetSubTypeText(InsuranceAssetSubType.Other)
            }
        ];
        return options;
    }
}



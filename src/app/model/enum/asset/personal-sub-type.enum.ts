export enum PersonalAssetSubType {
    SelfOccupiedProperty = <any>'SelfOccupiedProperty',
    ResidentialProperty = <any>'ResidentialProperty',
    Automobiles = <any>'Automobiles',
    Jewellery = <any>'Jewellery',
    Furniture = <any>'Furniture',
    ElectronicItems = <any>'ElectronicItems',
    Other = <any>'Other'
}

export class PersonalAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case PersonalAssetSubType.SelfOccupiedProperty: return 'Self Occupied Property';
            case PersonalAssetSubType.ResidentialProperty: return 'Residential Property';
            case PersonalAssetSubType.Automobiles: return 'Automobiles';
            case PersonalAssetSubType.Jewellery: return 'Jewellery';
            case PersonalAssetSubType.Furniture: return 'Furniture';
            case PersonalAssetSubType.ElectronicItems: return 'Electronic Items';
            case PersonalAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: PersonalAssetSubType.SelfOccupiedProperty,
                value: this.getAssetSubTypeText(PersonalAssetSubType.SelfOccupiedProperty)
            },
            {
                key: PersonalAssetSubType.ResidentialProperty,
                value: this.getAssetSubTypeText(PersonalAssetSubType.ResidentialProperty)
            },
            {
                key: PersonalAssetSubType.Automobiles,
                value: this.getAssetSubTypeText(PersonalAssetSubType.Automobiles)
            },
            {
                key: PersonalAssetSubType.Jewellery,
                value: this.getAssetSubTypeText(PersonalAssetSubType.Jewellery)
            },
            {
                key: PersonalAssetSubType.Furniture,
                value: this.getAssetSubTypeText(PersonalAssetSubType.Furniture)
            },
            {
                key: PersonalAssetSubType.ElectronicItems,
                value: this.getAssetSubTypeText(PersonalAssetSubType.ElectronicItems)
            },
            {
                key: PersonalAssetSubType.Other,
                value: this.getAssetSubTypeText(PersonalAssetSubType.Other)
            }
        ];
        return options;
    }
}

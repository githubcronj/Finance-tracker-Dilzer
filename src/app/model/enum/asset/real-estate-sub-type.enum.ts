export enum RealEstateAssetSubType {
    InvestmentApartment = <any>'InvestmentApartment',
    InvestmentPlot = <any>'InvestmentPlot',
    CommercialProperty = <any>'CommercialProperty',
    SmartOwner = <any>'SmartOwner',
    AgriculturalLand = <any>'AgriculturalLand',
    Other = <any>'Other'
}

export class RealEstateAssetSubtypeTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case RealEstateAssetSubType.InvestmentApartment: return 'Investment Apartment';
            case RealEstateAssetSubType.InvestmentPlot: return 'Investment Plot';
            case RealEstateAssetSubType.CommercialProperty: return 'Commercial Property';
            case RealEstateAssetSubType.SmartOwner: return 'Smart Owner';
            case RealEstateAssetSubType.AgriculturalLand: return 'Agricultural Land';
            case RealEstateAssetSubType.Other: return 'Other';
        }
    }


    public static getAllAssetSubType() {
        const options = [
            {
                key: RealEstateAssetSubType.InvestmentApartment,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.InvestmentApartment)
            },
            {
                key: RealEstateAssetSubType.InvestmentPlot,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.InvestmentPlot)
            },
            {
                key: RealEstateAssetSubType.CommercialProperty,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.CommercialProperty)
            },
            {
                key: RealEstateAssetSubType.SmartOwner,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.SmartOwner)
            },
            {
                key: RealEstateAssetSubType.AgriculturalLand,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.AgriculturalLand)
            },
            {
                key: RealEstateAssetSubType.Other,
                value: this.getAssetSubTypeText(RealEstateAssetSubType.Other)
            }
        ];
        return options;
    }
}

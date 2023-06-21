export enum GoalType {

    RetirementGoal = <any>'RetirementGoal',
    EmergencyFund = <any>'EmergencyFund',
    PostGraduation = <any>'PostGraduation',
    ChildGraduation = <any>'ChildGraduation',
    OtherHigherEducationGoals = <any>'OtherHigherEducationGoals',
    Wedding = <any>'Wedding',
    HealthCorpus = <any>'HealthCorpus',
    PropertyPurchase = <any>'PropertyPurchase',
    VacationGoal = <any>'VacationGoal',
    BusinessSetUp = <any>'BusinessSetUp',
    DependentCare = <any>'DependentCare',
    FinancialIndependence = <any>'FinancialIndependence',
    Donation = <any>'Donation',
    HomeRenovation = <any>'HomeRenovation',
    CarPurchaseGoal = <any>'CarPurchaseGoal',
    Other = <any> 'OtherGoal'
    
}

export class GoalTypeUtils {
    public static getGoalTypeText(type) {
        switch (type) {
            case GoalType.RetirementGoal: return 'Retirement Goal';
            case GoalType.EmergencyFund: return 'Emergency Fund';
            case GoalType.ChildGraduation: return 'Child Graduation';
            case GoalType.PostGraduation: return 'Post Graduation';
            case GoalType.OtherHigherEducationGoals: return 'Education Goal';
            case GoalType.Wedding: return 'Wedding';
            case GoalType.HealthCorpus: return 'Health Corpus';
            case GoalType.PropertyPurchase: return 'Property Purchase / Construction';
            case GoalType.VacationGoal: return 'Vacation Goal';
            case GoalType.BusinessSetUp: return 'Business Set Up / Start Up';
            case GoalType.DependentCare: return 'Dependent Care';
            case GoalType.FinancialIndependence: return 'Financial Independence';
            case GoalType.Donation: return 'Donation';
            case GoalType.HomeRenovation: return 'Home Renovation';
            case GoalType.CarPurchaseGoal: return 'Car Purchase Goal';            
            case GoalType.Other: return 'Others / Accumulation Goal';

        }
    }

    public static getGoalTypeImageName(type) {
        switch (type) {
            case GoalType.RetirementGoal: return  'retirement_icon.png';
            case GoalType.EmergencyFund: return 'emegency_funds_icon.png';
            case GoalType.ChildGraduation: return 'child_education_icon.png';
            case GoalType.PostGraduation: return 'post_graduation_icon.png';
            case GoalType.OtherHigherEducationGoals: return 'post_graduation_icon.png';
            case GoalType.Wedding: return 'wedding_icon.png';
            case GoalType.HealthCorpus: return 'health_corpus_icon.png';
            case GoalType.PropertyPurchase: return 'property_purchase_icon.png';
            case GoalType.VacationGoal: return 'vacation_icon.png';
            case GoalType.BusinessSetUp: return 'business_icon.png';
            case GoalType.DependentCare: return 'dependent_icon.png';
            case GoalType.FinancialIndependence: return 'independence_icon.png';
            case GoalType.Donation: return 'donate_icon.png';
            case GoalType.HomeRenovation: return 'home_renovate.png';
            case GoalType.CarPurchaseGoal: return 'car_buy_icon.png';
            case GoalType.Other: return 'accumulation_icon.png';

        }
    }

    public static getAllGoalType() {
        const options = [
            {
                key: GoalType.RetirementGoal,
                value: this.getGoalTypeText(GoalType.RetirementGoal),
                image: this.getGoalTypeImageName(GoalType.RetirementGoal)
            },
            {
                key: GoalType.EmergencyFund,
                value: this.getGoalTypeText(GoalType.EmergencyFund),
                image: this.getGoalTypeImageName(GoalType.EmergencyFund)
            },
            {
                key: GoalType.ChildGraduation,
                value: this.getGoalTypeText(GoalType.ChildGraduation),
                image: this.getGoalTypeImageName(GoalType.ChildGraduation)
            },
            {
                key: GoalType.PostGraduation,
                value: this.getGoalTypeText(GoalType.PostGraduation),
                image: this.getGoalTypeImageName(GoalType.PostGraduation)
            },
            {
                key: GoalType.OtherHigherEducationGoals,
                value: this.getGoalTypeText(GoalType.OtherHigherEducationGoals),
                image: this.getGoalTypeImageName(GoalType.OtherHigherEducationGoals)
            },
            {
                key: GoalType.Wedding,
                value: this.getGoalTypeText(GoalType.Wedding),
                image: this.getGoalTypeImageName(GoalType.Wedding)
            },
            {
                key: GoalType.HealthCorpus,
                value: this.getGoalTypeText(GoalType.HealthCorpus),
                image: this.getGoalTypeImageName(GoalType.HealthCorpus)
            },
            {
                key: GoalType.PropertyPurchase,
                value: this.getGoalTypeText(GoalType.PropertyPurchase),
                image: this.getGoalTypeImageName(GoalType.PropertyPurchase)
            },
            {
                key: GoalType.VacationGoal,
                value: this.getGoalTypeText(GoalType.VacationGoal),
                image: this.getGoalTypeImageName(GoalType.VacationGoal)
            },
            {
                key: GoalType.BusinessSetUp,
                value: this.getGoalTypeText(GoalType.BusinessSetUp),
                image: this.getGoalTypeImageName(GoalType.BusinessSetUp)
            },
            {
                key: GoalType.DependentCare,
                value: this.getGoalTypeText(GoalType.DependentCare),
                image: this.getGoalTypeImageName(GoalType.DependentCare)
            },
            {
                key: GoalType.FinancialIndependence,
                value: this.getGoalTypeText(GoalType.FinancialIndependence),
                image: this.getGoalTypeImageName(GoalType.FinancialIndependence)
            },
            {
                key: GoalType.Donation,
                value: this.getGoalTypeText(GoalType.Donation),
                image: this.getGoalTypeImageName(GoalType.Donation)
            },
            {
                key: GoalType.HomeRenovation,
                value: this.getGoalTypeText(GoalType.HomeRenovation),
                image: this.getGoalTypeImageName(GoalType.HomeRenovation)
            },
            {
                key: GoalType.CarPurchaseGoal,
                value: this.getGoalTypeText(GoalType.CarPurchaseGoal),
                image: this.getGoalTypeImageName(GoalType.CarPurchaseGoal)
            },
            {
                key: GoalType.Other,
                value: this.getGoalTypeText(GoalType.Other),
                image: this.getGoalTypeImageName(GoalType.Other)
            }
        ];
        return options;
    }
}


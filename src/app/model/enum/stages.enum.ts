export enum Stages {

    ClientRegistration = 0,
    SummittedInitalInformation = 1,
    ClientEngagmentAndInitialRegistrationFee = 2,
    DataCollection = 3,
    PlanPreparation = 4,
    Invoice = 5,
    PlanPresentation = 6,
    Implementation = 7,
    RegularClient = 8,
    GoalReview = 9

}


export class StagesUtils {
    public static getStagesText(stages) {
        switch (stages) {
            case Stages.ClientRegistration: return 'Registration';
            case Stages.SummittedInitalInformation: return 'Submitted Initial Information';
            case Stages.ClientEngagmentAndInitialRegistrationFee: return 'Plan Preparation';
            case Stages.DataCollection: return 'Data Collection';
            case Stages.PlanPreparation: return 'Plan Preparation';
            case Stages.Invoice: return 'Invoice';
            case Stages.PlanPresentation: return 'Plan Presentation';
            case Stages.Implementation: return 'Implementation';
            case Stages.RegularClient: return 'Regular Client';
            case Stages.GoalReview: return 'Goal Review';
        }
    }


    public static getStagesArray() {
        const StagesArray = [
            {
                key: Stages.ClientRegistration,
                value: this.getStagesText(Stages.ClientRegistration)
            },
            {
                key: Stages.SummittedInitalInformation,
                value: this.getStagesText(Stages.SummittedInitalInformation)
            },
            {
                key: Stages.ClientEngagmentAndInitialRegistrationFee,
                value: this.getStagesText(Stages.ClientEngagmentAndInitialRegistrationFee)
            },
            {
                key: Stages.DataCollection,
                value: this.getStagesText(Stages.DataCollection)
            },
            {
                key: Stages.PlanPreparation,
                value: this.getStagesText(Stages.PlanPreparation)
            },
            {
                key: Stages.Invoice,
                value: this.getStagesText(Stages.Invoice)
            },
            {
                key: Stages.PlanPresentation,
                value: this.getStagesText(Stages.PlanPresentation)
            },
            {
                key: Stages.Implementation,
                value: this.getStagesText(Stages.Implementation)
            },
            {
                key: Stages.RegularClient,
                value: this.getStagesText(Stages.RegularClient)
            },
            {
                key: Stages.GoalReview,
                value: this.getStagesText(Stages.GoalReview)
            }
        ];
        return StagesArray;
    }
}

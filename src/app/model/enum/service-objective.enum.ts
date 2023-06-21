export enum ServiceObjective {
    ShortTermFinancialGoals = 0,
    LongTermFinancialStability = 1,
    ProgressiveWealthGeneration = 2,
    StructureCurrentInvestment = 3
}

export class ServiceObjectiveUtils {
    public static getServiceObjectiveText(objective) {
        switch (objective) {
            case ServiceObjective.ShortTermFinancialGoals: return 'Short Term Financial Goals';
            case ServiceObjective.LongTermFinancialStability: return 'Long Term Financial Stability';
            case ServiceObjective.ProgressiveWealthGeneration: return 'Progressive Wealth Generation';
            case ServiceObjective.StructureCurrentInvestment: return 'Structure Current Investment';
        }
    }



    public static getAllServiceObjectives() {
        const options = [
            {
                key: ServiceObjective.ShortTermFinancialGoals,
                value: this.getServiceObjectiveText(ServiceObjective.ShortTermFinancialGoals)
            },
            {
                key: ServiceObjective.LongTermFinancialStability,
                value: this.getServiceObjectiveText(ServiceObjective.LongTermFinancialStability)
            },
            {
                key: ServiceObjective.ProgressiveWealthGeneration,
                value: this.getServiceObjectiveText(ServiceObjective.ProgressiveWealthGeneration)
            },
            {
                key: ServiceObjective.StructureCurrentInvestment,
                value: this.getServiceObjectiveText(ServiceObjective.StructureCurrentInvestment)
            }
        ];
        return options;
    }

}
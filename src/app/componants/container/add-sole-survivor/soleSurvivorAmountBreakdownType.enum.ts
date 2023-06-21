export enum SoleSurvivorAmountBreakdownType {
    AmountViaEstimatedTotal = 0,
    AmountViaExpenseBreakdown = 1,

}

export class SoleSurvivorAmountBreakdownTypeUtils {
    public static getSoleSurvivorAmountBreakdownTypeText(type) {
        switch (type) {
            case SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal: return 'Estimated total';
            case SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown: return 'Expense breakdown';
        }
    }


    public static getAllSoleSurvivorAmountBreakdownType() {
        const options = [
            {
                key: SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal,
                value: this.getSoleSurvivorAmountBreakdownTypeText(SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal)
            },
            {
                key: SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown,
                value: this.getSoleSurvivorAmountBreakdownTypeText(SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown)
            }
        ];
        return options;
    }
}
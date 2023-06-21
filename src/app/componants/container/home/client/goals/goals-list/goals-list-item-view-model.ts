import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GoalTypeUtils } from '../../../../../../model/enum/goal-type.enum'
import { Goal } from '../../../../../../model/goal/goal';


export class GoalsListItemViewModel {


    public name: String;
    public goalTypeDisplayString: String;
    public currentValuationDisplayString: String;
    public inflationRateDisplayString: String;
    public imageName: String;
    public owner: String;
    public isSelectedForDelete: Boolean;
    public goal: Goal
    public goalCreatedDate;
    public corpusRequiredDisplayString;


    constructor(currencyFormatter: CurrencyFormatter, name: String, kind: String, currentValuation: Number, inflationRate: Number, owner: String, corpusRequired: Number, goal: Goal) {
        this.name = name;
        this.goalTypeDisplayString = GoalTypeUtils.getGoalTypeText(kind);
        this.currentValuationDisplayString = '₹' + currencyFormatter.currencyFormatter(currentValuation);
        this.inflationRateDisplayString = inflationRate + "%";
        this.imageName = GoalTypeUtils.getGoalTypeImageName(kind);
        this.owner = owner;
        this.goal = goal;
        this.goalCreatedDate = goal.createdDateDisplayString();
        this.corpusRequiredDisplayString = '₹' + currencyFormatter.currencyFormatter(corpusRequired);
    }
}
import { Attachment } from '../asset/attachment/attachment';
import { GoalTypeUtils } from '../enum/goal-type.enum';
import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { GoalTimeLine } from './goalTimeLine'
import { RateOfReturn } from '../../model/rateOfReturn';
import { Client } from '../../model/client';
import { SoleSurvivor } from './soleSurvivor';
import { FormatterService } from 'app/services/formatter.service';
import { Allocation } from './allocation';
import { CorpusRequired } from './corpus-required';


@JsonObject
export class Goal {

    @JsonProperty('_id', String) _id: string = undefined
    @JsonProperty('kind', String) kind: string = undefined
    @JsonProperty('name', String) name: string = undefined
    @JsonProperty('currentValuation', Number) currentValuation: number = undefined
    @JsonProperty('inflationRate', Number) inflationRate: number = undefined
    @JsonProperty('createdAt', Date) createdAt: Date = undefined
    @JsonProperty('updatedAt', Date) updatedAt: Date = undefined
    @JsonProperty('description', String) description: string = undefined
    @JsonProperty('goalTimeLine', GoalTimeLine) goalTimeLine: GoalTimeLine = undefined
    @JsonProperty('rateOfReturns', [RateOfReturn]) rateOfReturns: RateOfReturn[] = []
    @JsonProperty('owners', [String]) owners: string[] = []
    @JsonProperty('soleSurvivor', SoleSurvivor) soleSurvivor: SoleSurvivor = new SoleSurvivor()
    @JsonProperty('allocations', [Allocation]) allocations: Allocation[] = []
    @JsonProperty('corpusRequired', CorpusRequired) corpusRequired: CorpusRequired = undefined
    @JsonProperty('priority', Number) priority: number = undefined
    @JsonProperty('needInsuranceAnalysis', Boolean) needInsuranceAnalysis: boolean = undefined

    isSelected = false;
    formatter = new FormatterService()

    static discriminatorInfo = {
        key: 'kind',
        subclasses: {

            'RetirementGoal': 'RetirementGoal',
            'EmergencyFund': 'EmergencyFund',
            'PostGraduation': 'PostGraduation',
            'ChildGraduation': 'ChildGraduation',
            'OtherHigherEducationGoals': 'OtherHigherEducationGoals',
            'Wedding': 'Wedding',
            'HealthCorpus': 'HealthCorpus',
            'PropertyPurchase': 'PropertyPurchase',
            'VacationGoal': 'VacationGoal',
            'BusinessSetUp': 'BusinessSetUp',
            'DependentCare': 'DependentCare',
            'FinancialIndependence': 'FinancialIndependence',
            'Donation': 'Donation',
            'HomeRenovation': 'HomeRenovation',
            'Other': 'Other'
        }
    }

    constructor() {

    }

    displayGoalTypeName() {
        return GoalTypeUtils.getGoalTypeText(this.kind)
    }

    createdDateDisplayString() {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.createdAt, 'dd/MM/yyyy');
    }


    displayGoalStartDate(client: Client) {

        let date = this.goalTimeLine.startDate.projectedStartDate(client)
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, 'dd/MM/yyyy');

    }


    displayGoalEndDate(client: Client) {

        let date = this.goalTimeLine.endDate.projectedStartDate(client)
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, 'dd/MM/yyyy');

    }

    static getTotolGoalExpense(goals) {

        let goalExpenseAmount = 0

        for (let goal of goals) {
            goalExpenseAmount += goal.currentValuation
        }

        return goalExpenseAmount
    }

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);

    }
}

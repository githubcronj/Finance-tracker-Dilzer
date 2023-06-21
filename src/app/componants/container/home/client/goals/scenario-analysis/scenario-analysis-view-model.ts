import { Injectable } from '@angular/core';
import { GoalType, GoalTypeUtils } from '../../../../../../model/enum/goal-type.enum';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { Goal } from '../../../../../../model/goal/goal';
import { GoalRepository } from '../../../../../../repository/goal/goal.repository';
import { UserRepository } from '../../../../../../repository/user/user.repository';
import { Client } from '../../../../../../model/client';
import { MaterialDialogPaddingRemover } from '../../../../../../core/material-dialog-padding-remover';
import { GoalTimeLine } from '../../../../../../model/goal/goalTimeLine';
import { DatePipe } from '@angular/common';


@Injectable()
export class ScenarioAnalysisViewModel {

    goals: Array<Goal> = [];
    goalsDropDownList: any = [];
    clientId;
    currencyFormatter = new CurrencyFormatter();
    clientDetail: Client;
    goalTimeLine = new GoalTimeLine();
    selectedGoalId = '';
    selectedGoal: Goal;
    currentValuation: Number;
    inflationRate: Number;
    isGoalHAppenMoreThanYear = false;
    showEndDate = false;
    inflationList = [];
    goalFrequency = [];
    analysedGoalsList = [];

    constructor(
        private goalRepo: GoalRepository,
        private userRepo: UserRepository
    ) {
        for (let i = 4; i <= 10; i++) {
            this.inflationList.push(i)
        }
        for (let i = 1; i <= 10; i++) {
            this.goalFrequency.push({ key: i, value: `Every ${Math.abs(i)} year` })
        }
    }

    async getAllGoalInfos() {

        try {
            const clientResponse = await this.userRepo.getClient(this.clientId);
            this.clientDetail = clientResponse;

            this.goals = [];
            const goalResponse = await this.goalRepo.getAllGoals(this.clientId);
            this.goals = goalResponse;
            this.goals = this.goals.filter((goal) => {
                return (goal.corpusRequired.assets && goal.corpusRequired.assets.length > 0);
            });

        } catch (error) {
            throw error
        }
    }

    async populateSeletedGoalDetails() {
        this.selectedGoal = this.goals.find((goal) => goal._id == this.selectedGoalId);
        if (this.selectedGoal) {
            this.currentValuation = this.selectedGoal.currentValuation;
            this.inflationRate = this.selectedGoal.inflationRate;

            if (this.selectedGoal.goalTimeLine && this.selectedGoal.goalTimeLine.endDate) {
                this.isGoalHAppenMoreThanYear = true
                this.showEndDate = true
            } else {
                this.showEndDate = false
                this.isGoalHAppenMoreThanYear = false
            }
            if (this.selectedGoal.goalTimeLine) {
                this.goalTimeLine = this.selectedGoal.goalTimeLine
            }
            if (this.selectedGoal.goalTimeLine.frequency == null) {
                this.selectedGoal.goalTimeLine.frequency = this.goalFrequency[0].key
            }
            this.analysedGoalsList = [];
            this.analysedGoalsList.push(this.selectedGoal);
        }
    }

    constructStartDate(goalTimeLine) {
        if (goalTimeLine && goalTimeLine.startDate) {
            const startDate = goalTimeLine.startDate.projectedStartDate(this.clientDetail);
            return this.convertDateFormat(startDate);
        }
    }

    constructEndDate(goalTimeLine) {
        if (goalTimeLine && goalTimeLine.endDate) {
            const endDate = goalTimeLine.endDate.projectedStartDate(this.clientDetail);
            return this.convertDateFormat(endDate);
        } else {
            return this.constructStartDate(goalTimeLine);
        }
    }


    async analyseGoalFunding() {
        try {
            const analyseGoalData = {
                'currentValuation': this.currentValuation,
                'inflationRate': this.inflationRate,
                'goalTimeLine': this.goalTimeLine
            }
            const analyseGoal = await this.goalRepo.analyseGoalScenario(this.clientId, this.selectedGoalId, analyseGoalData);
            this.analysedGoalsList.push(analyseGoal);
        } catch (error) {
            throw error;
        }
    }

    displayCurrency(amount) {
        return this.currencyFormatter.currencyFormatter(amount);
    }

    convertDateFormat(date) {
        if (date != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        }
    }


}

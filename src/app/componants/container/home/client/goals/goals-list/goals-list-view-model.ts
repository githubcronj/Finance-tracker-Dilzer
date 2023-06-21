import { Injectable } from '@angular/core';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GoalRepository } from '../../../../../../repository/goal/goal.repository'
import { GoalsListItemViewModel } from './goals-list-item-view-model'


@Injectable()
export class GoalsListViewModel {


    public clientId;
    public totalAmountDisplayString: String;
    public totalCorpusRequiredDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public goalsSelectedForDelete = 0;
    public searchTerm;
    private goals = [];
    public goalItems;
    public tempGoalList;


    constructor(private goalRepository: GoalRepository) { }


    async getGoals() {

        try {
            this.goalItems = new Array<GoalsListItemViewModel>();
            this.goals = [];
            this.goals = await this.goalRepository.getAllGoals(this.clientId);
            this.getTotalAmount();
        } catch (error) {
            throw error;
        }
    }


    getTotalAmount() {

        let totalAmount = 0;
        let totalCorpusRequired = 0;
        this.goalItems = [];
        for (let goal of this.goals) {
            this.goalItems.push(new GoalsListItemViewModel(this.currencyFormatter, goal.name, goal.kind, goal.currentValuation, goal.inflationRate, goal.owner, goal.corpusRequired
                .amount, goal));
            totalAmount += goal.currentValuation;
            totalCorpusRequired += goal.corpusRequired.amount;
        }
        this.totalCorpusRequiredDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCorpusRequired);
        this.totalAmountDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalAmount);
    }


    async deleteGoal(id) {
        try {
            if (confirm('Are you sure you want to delete this goal?') == true) {
                let response = await this.goalRepository.deleteGoal(this.clientId, id);
                await this.getGoals();
                this.goalsSelectedForDelete = 0
            }
        } catch (error) {
            throw error;
        }

    }


    async deleteSelectedGoals() {
        let selectedGoals = this.goalItems.filter(goal => { return goal.isSelectedForDelete });
        selectedGoals = selectedGoals.map(goal => { return goal.goal._id })
        try {
            if (selectedGoals.length > 0) {
                if (confirm('Are you sure you want to delete the selected goals?') == true) {
                    let response = await this.goalRepository.deleteSelectedGoals(this.clientId, selectedGoals);
                    await this.getGoals();
                    this.goalsSelectedForDelete = 0;
                }
            }
        } catch (error) {
            throw error;
        }

    }


    countSelected() {
        this.goalsSelectedForDelete = this.goalItems.filter(function (x) { return x.isSelectedForDelete; }).length;
    }


    selectDeselectAll(checked) {
        const count = 0;
        if (checked) {
            this.goalItems.map((x) => {
                x.isSelectedForDelete = true;
                return x
            });
            this.countSelected();
        } else {
            this.goalItems.map((x) => {
                x.isSelectedForDelete = false;
                return x
            });
            this.countSelected();
        }
    }


    searchGoalsList() {

        this.getTotalAmount()
        const key = this.searchTerm.toLowerCase();
        this.tempGoalList = [];
        this.tempGoalList = this.goalItems
        this.goalItems = this.tempGoalList.filter((goal) => {

            if (goal.goal.currentValuation == parseFloat(key)) {
                return true
            }
            return this.matchString(goal.name, key) || this.matchString(goal.goal.kind, key) || this.matchString(goal.goalTypeDisplayString, key) || this.matchString(goal.currentValuationDisplayString, key) || this.matchString(goal.inflationRateDisplayString, key) || this.matchString(goal.goalCreatedDate, key) || this.matchString(goal.inflationRateDisplayString, key);
        });
    }


    matchString(keyword, key) {

        if (keyword == null) {
            return false
        } else {
            return new RegExp(key, 'gi').test(keyword.trim().toLowerCase())
        }
    }


    async swapGoalsPriority() {
        let sortedGoals = [];

        for (let goal of this.goalItems) {
            sortedGoals.push({ '_id': goal.goal._id });
        }

        try {
            let response = await this.goalRepository.swapGoalPriority(this.clientId, sortedGoals);
            await this.getGoals();
            return response;
        } catch (error) {
            throw error;
        }
    }

}
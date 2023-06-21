import { Injectable } from '@angular/core';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository'
import { ExpenseCategoryTypeViewModel } from './expense-category-type-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';


@Injectable()
export class ExpenseCategoryViewModel {


    private expenses = [];
    public clientId;
    public expenseItems;
    public totalCurrentLivingExpensesDisplayString: String;
    public totalEarlyRetirementExpensesDisplayString: String;
    public totalLateRetirementExpensesDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public graphData;


    constructor(private cashflowRepository: CashflowRepository) {

    }


    public async getExpenses() {
        try {
            let totalCurrentLivingExpenses = 0;
            let totalEarlyRetirementExpenses = 0;
            let totalLateRetirementExpenses = 0;
            this.expenseItems = new Array<ExpenseCategoryTypeViewModel>();
            this.expenses = await this.cashflowRepository.getExpenses(this.clientId);
            for (let expense of this.expenses) {
                this.expenseItems.push(new ExpenseCategoryTypeViewModel(this.currencyFormatter, expense.kind, expense.currentLivingExpenses, expense.earlyRetirementExpenses, expense.lateRetirementExpenses));
                totalCurrentLivingExpenses += expense.currentLivingExpenses;
                totalEarlyRetirementExpenses += expense.earlyRetirementExpenses;
                totalLateRetirementExpenses += expense.lateRetirementExpenses;
            }

            this.totalCurrentLivingExpensesDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCurrentLivingExpenses);
            this.totalEarlyRetirementExpensesDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalEarlyRetirementExpenses);
            this.totalLateRetirementExpensesDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalLateRetirementExpenses);


            this.graphData = new GraphDataSet('Expenses');
            for (let item of this.expenseItems) {
                this.graphData.labels.push(item.toString());
                this.graphData.datasets[0].data.push(item.currentLivingExpenses);
                this.graphData.datasets[0].backgroundColor.push(item.color);
            }

        } catch (error) {
            throw error;
        }
    }

}
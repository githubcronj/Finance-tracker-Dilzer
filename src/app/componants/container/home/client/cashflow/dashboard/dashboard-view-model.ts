import { Injectable } from '@angular/core';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository'
import { DashboardListItemViewModel } from './dashboard-list-item-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';


@Injectable()
export class DashboardViewModel {

    private cashflow;
    public clientId;
    public cashflowItems;
    public totalCashflow;
    public totalCashflowDisplayString;
    private currencyFormatter = new CurrencyFormatter();
    public graphOptions;
    public graphData;

    constructor(private cashflowRepository: CashflowRepository) {

    }


    async getCashflow() {

        try {

            this.cashflow = await this.cashflowRepository.getTotalCashflow(this.clientId);
            this.cashflowItems = new Array<DashboardListItemViewModel>();
            this.cashflowItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Incomes", this.cashflow.incomesPercentage, this.cashflow.incomes, '#C0392B'));
            this.cashflowItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Expenses", this.cashflow.expensePercentage, this.cashflow.expenses, '#AF7AC5'));
            this.cashflowItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Committed Savings", this.cashflow.committedSavingsPercentage, this.cashflow.committedSavings, '#5DADE2'));
            this.cashflowItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Committed Repayments", this.cashflow.committedRepaymentsPercentage, this.cashflow.committedRepayments, '#FFEFD5'));
            this.totalCashflow = this.cashflow.cashflow
            this.totalCashflowDisplayString = '₹' + this.currencyFormatter.currencyFormatter(this.cashflow.cashflow);

            this.graphData = new GraphDataSet('Cashflow');
            for (let item of this.cashflowItems) {
                this.graphData.labels.push(item.toString());
                this.graphData.datasets[0].data.push(item.amount);
                this.graphData.datasets[0].backgroundColor.push(item.color);
            }

        } catch (error) {
            throw error;
        }
    }
}

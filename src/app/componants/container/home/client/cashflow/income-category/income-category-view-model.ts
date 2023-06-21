import { Injectable } from '@angular/core';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository'
import { IncomeCategoryTypeViewModel } from './income-category-type-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';


@Injectable()
export class IncomeCategoryViewModel {


    private incomes = [];
    public clientId;
    public incomeItems;
    public totalAmountDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public graphData;

    constructor(private cashflowRepository: CashflowRepository) {

    }


    async getIncomes() {

        try {
            let totalAmount = 0;
            this.incomeItems = new Array<IncomeCategoryTypeViewModel>();
            this.incomes = await this.cashflowRepository.getIncomes(this.clientId);

            for (let income of this.incomes) {
                this.incomeItems.push(new IncomeCategoryTypeViewModel(this.currencyFormatter, income.kind, income.amount));
                totalAmount += income.amount;
            }
            this.totalAmountDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalAmount);

            this.graphData = new GraphDataSet('Incomes');
            for (let item of this.incomeItems) {
                this.graphData.labels.push(item.toString());
                this.graphData.datasets[0].data.push(item.amount);
                this.graphData.datasets[0].backgroundColor.push(item.color);
            }

        } catch (error) {
            throw error;
        }
    }

}
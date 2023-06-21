import { Injectable } from '@angular/core';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository'
import { IncomeListItemViewModel } from './income-list-item-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';


@Injectable()
export class IncomesListViewModel {

    private incomes = [];
    public clientId;
    public incomeItems;
    public totalAmountDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public incomeSelectedForDelete = 0;
    public searchTerm;
    public tempIncomeList;
    public kind;
    public clientDetails;
    public kindDisplayString;

    constructor(private cashflowRepository: CashflowRepository) {

    }


    async getIncomes(kind) {
        try {
            this.incomeItems = new Array<IncomeListItemViewModel>();
            this.incomes = [];
            this.incomes = await this.cashflowRepository.getIncomesBasedOnKind(this.clientId, kind);
            this.getTotalIncomeAmount();
        } catch (error) {
            throw error;
        }
    }


    getTotalIncomeAmount() {

        let totalAmount = 0;
        this.incomeItems = [];
        for (let income of this.incomes) {
            this.incomeItems.push(new IncomeListItemViewModel(this.currencyFormatter, income, this.clientDetails.ownerOfResourceList()))
            totalAmount += income.amount;
        }

        if (this.incomeItems && this.incomeItems[0]) {
            this.kindDisplayString = this.incomeItems[0].incomeTypeDisplayString;
        }

        this.totalAmountDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalAmount);
    } catch(error) {
        throw error;
    }


    async deleteIncome(id) {
        try {
            if (confirm('Are you sure you want to delete this income?') == true) {
                let response = await this.cashflowRepository.deleteIncome(this.clientId, id);
                await this.getIncomes(this.kind);
                this.incomeSelectedForDelete = 0
            }
        } catch (error) {
            throw error;
        }

    }


    async deleteSelectedIncomes() {
        let selectedIncomes = this.incomeItems.filter(income => { return income.isSelectedForDelete });
        selectedIncomes = selectedIncomes.map(income => { return income.income._id })
        try {
            if (selectedIncomes.length > 0) {
                if (confirm('Are you sure you want to delete this income?') == true) {
                    let response = await this.cashflowRepository.deleteSelectedIncomes(this.clientId, selectedIncomes);
                    await this.getIncomes(this.kind);
                    this.incomeSelectedForDelete = 0;
                }
            }
        } catch (error) {
            throw error;
        }

    }


    countSelected() {
        this.incomeSelectedForDelete = this.incomeItems.filter(function (x) { return x.isSelectedForDelete; }).length;
    }


    selectDeselectAll(checked) {
        const count = 0;
        if (checked) {
            this.incomeItems.map((x) => {
                x.isSelectedForDelete = true;
                return x
            });
            this.countSelected();
        } else {
            this.incomeItems.map((x) => {
                x.isSelectedForDelete = false;
                return x
            });
            this.countSelected();
        }
    }


    searchIncomeList() {

        this.getTotalIncomeAmount()
        const key = this.searchTerm.toLowerCase();
        this.tempIncomeList = [];
        this.tempIncomeList = this.incomeItems
        this.incomeItems = this.tempIncomeList.filter((income) => {

            if (income.income.amount == parseFloat(key)) {
                return true
            }
            return this.matchString(income.incomeTypeDisplayString, key) || this.matchString(income.income.owner, key) || this.matchString(income.income.kind, key) || this.matchString(income.amountDisplayString, key) || this.matchString(income.income.name, key) || this.matchString(income.createdDateDisplayString, key) || this.matchString(income.growthRateDisplayString, key) || this.matchString(income.income.growthRate + '%', key);
        });
    }


    matchString(keyword, key) {

        if (keyword == null) {
            return false
        } else {
            return new RegExp(key, 'gi').test(keyword.trim().toLowerCase())
        }
    }

}
import { Injectable } from '@angular/core';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository'
import { DashboardListItemViewModel } from './dashboard-list-item-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';

@Injectable()
export class DashboardViewModel {

    private networth;
    public clientId;
    public networthItems;
    public totalNetworth;
    public totalNetworthDisplayString;
    private currencyFormatter = new CurrencyFormatter()
    public graphOptions
    public graphData;
    public isEmptyNetworth;

    constructor(private networthRepository: NetworthRepository) {

    }

    async getNetworth() {

        try {

            this.networth = await this.networthRepository.getTotalNetworth(this.clientId);

            if (this.networth.financialAssets == 0 && this.networth.otherAssets == 0 && this.networth.liabilities == 0) {

            }
            this.networthItems = new Array<DashboardListItemViewModel>();
            this.networthItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Financial Assets", this.networth.financialAssetsPercentage, this.networth.financialAssets, '#C0392B'))
            this.networthItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Other Assets", this.networth.otherAssetsPercentage, this.networth.otherAssets, '#AF7AC5'))
            this.networthItems.push(new DashboardListItemViewModel(this.currencyFormatter, "Liability", this.networth.liabilitiesPercentage, this.networth.liabilities, '#5DADE2'))
            this.totalNetworth = this.networth.networth;
            this.totalNetworthDisplayString = '₹' + this.currencyFormatter.currencyFormatter(this.networth.networth)

            this.graphData = new GraphDataSet('Networth')
            for (let item of this.networthItems) {

                this.graphData.labels.push(item.toString())
                this.graphData.datasets[0].data.push(item.amount);
                this.graphData.datasets[0].backgroundColor.push(item.color);

            }

        } catch (error) {
            throw error;
        }
    }
}

import { Injectable } from '@angular/core';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository'
import { LiabilitiesTypeViewModel } from './liabilities-type-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';
import { LiabilityTypeUtils } from '../../../../../../model/enum/liability-type.enum'

@Injectable()
export class LiabilitiesCategoryViewModel {

    private liabilities = [];
    public clientId;
    public assetCategoryType;
    public liabilitiesItems;
    public totalValuationDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public graphData;
    public liabilityTypeUtils = LiabilityTypeUtils;

    constructor(private networthRepository: NetworthRepository) {

    }

    async getLiabilities() {

        try {
            this.liabilitiesItems = new Array<LiabilitiesTypeViewModel>();
            this.liabilities = await this.networthRepository.getLiabilitiesCategory(this.clientId);
        
            let totalCurrentValuation = 0;
        for (let liability of this.liabilities) {
            this.liabilitiesItems.push(new LiabilitiesTypeViewModel(this.currencyFormatter, liability.kind, liability.currentValuation))
            totalCurrentValuation += liability.currentValuation;
        }
        this.totalValuationDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCurrentValuation);


        this.graphData = new GraphDataSet('Liabilities')
        for (let item of this.liabilitiesItems) {

            this.graphData.labels.push(item.liabilityTypeDisplayString)
            this.graphData.datasets[0].data.push(item.currentValuation);
            this.graphData.datasets[0].backgroundColor.push(item.color);

        }
    } catch(error) {
        throw error;
    }
}

}
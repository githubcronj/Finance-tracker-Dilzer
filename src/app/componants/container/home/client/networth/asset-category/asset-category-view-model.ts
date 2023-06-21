import { Injectable } from '@angular/core';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository'
import { AssetTypeViewModel } from './asset-type-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';
import { AssetCategory } from '../../../../../../model/enum/asset/asset-category.enum';
import { AssetTypeUtils } from '../../../../../../model/enum/asset/asset-type.enum'

@Injectable()
export class AssetCategoryViewModel {

    private assets = [];
    public clientId;
    public assetCategoryType;
    public assetItems;
    public totalValuationDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public graphData;
    public heading;
    public assetTypeUtils = AssetTypeUtils;

    constructor(private networthRepository: NetworthRepository) {

    }

    async getAssets() {

        try {
            this.assetItems = new Array<AssetTypeViewModel>();

            if (this.assetCategoryType == AssetCategory.FinancialAsset) {
                this.assets = await this.networthRepository.getFinancialAssets(this.clientId);
                this.heading = "Financial Assets";
                this.graphData = new GraphDataSet('Financial Assets');
            } else {
                this.assets = await this.networthRepository.getOtherAssets(this.clientId);
                this.heading = "Other Assets";
                this.graphData = new GraphDataSet('Other Assets');
            }
            let totalCurrentValuation = 0;
            for (let asset of this.assets) {
                this.assetItems.push(new AssetTypeViewModel(this.currencyFormatter, asset.kind, asset.currentValuation))
                totalCurrentValuation += asset.currentValuation;
            }
            this.totalValuationDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCurrentValuation);

            for (let item of this.assetItems) {

                this.graphData.labels.push(item.assetTypeDisplayString)
                this.graphData.datasets[0].data.push(item.currentValuation);
                this.graphData.datasets[0].backgroundColor.push(item.color);

            }
        } catch (error) {
            throw error;
        }
    }

}
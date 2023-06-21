import { Injectable } from '@angular/core';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository'
import { AssetListViewModel } from './asset-list-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';
import { AssetCategory } from '../../../../../../model/enum/asset/asset-category.enum'

@Injectable()
export class AssetsViewModel {

    private assets = [];
    public clientId;
    public assetItems;
    public totalValuationDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public assetSelectedForDelete;
    public searchTerm;
    public tempAssetList;
    public kind;
    public clientDetails;
    public kindDisplayString;

    constructor(private networthRepository: NetworthRepository) {

    }

    async getAssets(kind) {

        try {
            this.assetItems = new Array<AssetListViewModel>();
            this.assets = [];
            let response = await this.networthRepository.getAssets(this.clientId, kind);
            this.assets = response
            this.getTotalAssetCurrentValuation()

        } catch (error) {
            throw error;
        }
    }

    getTotalAssetCurrentValuation() {

        let totalCurrentValuation = 0;
        this.assetItems = [];
        for (let asset of this.assets) {
            this.assetItems.push(new AssetListViewModel(this.currencyFormatter, asset, this.clientDetails.ownerOfResourceList()))
            totalCurrentValuation += asset.currentValuation;
        }
        if (this.assetItems && this.assetItems[0]) {
            this.kindDisplayString = this.assetItems[0].assetTypeDisplayString;
        }
        this.totalValuationDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCurrentValuation);
    }


    async deleteAsset(id) {
        try {
            if (confirm('Are you sure you want to delete this asset?') == true) {
                let response = await this.networthRepository.deleteAsset(this.clientId, id);
                await this.getAssets(this.kind);
                this.assetSelectedForDelete = 0
            }
        } catch (error) {
            throw error;
        }

    }

    async deleteSelectedAssets() {
        let selectedAssetsArray = this.assetItems.filter(asset => { return asset.isSelectedForDelete });
        selectedAssetsArray = selectedAssetsArray.map(asset => { return asset.asset._id })
        try {
            if (selectedAssetsArray.length > 0) {
                if (confirm('Are you sure you want to delete this asset?') == true) {
                    let response = await this.networthRepository.deleteSelectedAssets(this.clientId, selectedAssetsArray);
                    await this.getAssets(this.kind);
                    this.assetSelectedForDelete = 0
                }
            }
        } catch (error) {
            throw error;
        }

    }
    countSelected() {
        this.assetSelectedForDelete = this.assetItems.filter(function (x) { return x.isSelectedForDelete; }).length;
    }

    selectDeselectAll(checked) {
        const count = 0;
        if (checked) {
            this.assetItems.map((x) => {
                x.isSelectedForDelete = true;
                return x
            });
            this.countSelected();
        } else {
            this.assetItems.map((x) => {
                x.isSelectedForDelete = false;
                return x
            });
            this.countSelected();
        }
    }


    searchAssetList() {

        this.getTotalAssetCurrentValuation()
        const key = this.searchTerm.toLowerCase();
        this.tempAssetList = [];
        this.tempAssetList = this.assetItems
        this.assetItems = this.tempAssetList.filter((asset) => {

            if (asset.asset.currentValuation == parseFloat(key)) {
                return true
            }
            return this.matchString(asset.asset.name, key) || this.matchString(asset.asset.owner, key) || this.matchString(asset.currentValuationDisplayString, key) || this.matchString(asset.asset.assetSubtype, key) || this.matchString(asset.asset.kind, key) || this.matchString(asset.committedSavingDisplayString, key) || this.matchString(asset.ownerName, key) || this.matchString(asset.assetSubTypeDisplayString, key) || this.matchString(asset.createdDateDisplayString, key);
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
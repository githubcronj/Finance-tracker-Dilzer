import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { AssetTypeUtils } from '../../../../../../model/enum/asset/asset-type.enum';
import { Client } from '../../../../../../model/client';
import { Asset } from '../../../../../../model/asset/asset';

export class AssetListViewModel {

    asset: Asset;
    assetTypeDisplayString: String;
    currentValuationDisplayString: String;
    committedSavingDisplayString: String;
    imageName: String;
    createdDateDisplayString: String;
    isSelectedForDelete: Boolean;
    ownerName: String;
    assetSubTypeDisplayString: String;

    constructor(currencyFormatter: CurrencyFormatter, asset: Asset, ownerOfResourceList) {
        this.asset = asset;
        this.assetTypeDisplayString = AssetTypeUtils.getAssetTypeText(asset.kind);
        this.currentValuationDisplayString = '₹' + currencyFormatter.currencyFormatter(asset.currentValuation)
        this.imageName = AssetTypeUtils.getAssetTypeImageName(asset.kind);
        this.committedSavingDisplayString = asset.totalCommitedSavingDisplayString();
        this.createdDateDisplayString = asset.createdDateDisplayString();
        this.ownerName = this.getOwnerName(ownerOfResourceList, asset.owners)
        this.assetSubTypeDisplayString = asset.getSubAssetType()
    }


    getOwnerName(ownersList, assetOwner) {
        let id;
        if (assetOwner.length > 1) {
            id = assetOwner[0] + '&' + assetOwner[1], ownersList;
        } else {
            id = assetOwner[0], ownersList;
        }
        for (let owner of ownersList) {

            if (id == owner.key) {

                return owner.value;
            }
        }
    }
}



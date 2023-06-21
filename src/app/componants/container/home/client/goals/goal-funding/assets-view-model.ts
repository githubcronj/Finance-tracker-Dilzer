import { Asset } from '../../../../../../model/asset/asset'
import { Goal } from '../../../../../../model/goal/goal';
import { AssetType, AssetTypeUtils } from '../../../../../../model/enum/asset/asset-type.enum';
import { DatePipe } from '@angular/common';


export class AssetsViewModel {

    model: Asset;
    name: String;
    currentValuationDisplayString = 0;
    currencyFormatter: any;
    isMappedToGoal = false;
    assetTypeDisplayString: String;
    assetSubTypeDisplayString: String;
    maturityDateString: String;
    maturityDate: Date;

    constructor(currencyFormatter, model, goals) {

        this.model = model;
        this.name = model.name;
        this.currencyFormatter = currencyFormatter;
        this.maturityDate = (this.model.maturityDate) ? this.model.maturityDate : undefined;
        this.maturityDateString = (this.model.maturityDate) ? this.convertDateFormat(this.model.maturityDate) : undefined;
        this.currentValuationDisplayString = this.displayCurrency(model.currentValuation);
        this.assetTypeDisplayString = AssetTypeUtils.getAssetTypeText(model.kind);
        this.assetSubTypeDisplayString = model.getSubAssetType();
        for (const goal of goals) {
            if (goal.model.map && goal.model.map.assets.length > 0) {
                for (const assetAllocated of goal.model.map.assets) {
                    if (assetAllocated._id == model._id) {
                        this.isMappedToGoal = true;
                    }
                }
            }
        }

    }

    getImage() {
        return AssetTypeUtils.getAssetTypeImageName(this.model.kind);
    }

    displayCurrency(amount) {
        return this.currencyFormatter.currencyFormatter(amount);
    }

    convertDateFormat(date) {
        if (date != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        }
    }
}

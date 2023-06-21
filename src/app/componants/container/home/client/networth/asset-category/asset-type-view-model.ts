import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { AssetTypeUtils} from '../../../../../../model/enum/asset/asset-type.enum'

export class AssetTypeViewModel {

    kind: String;
    assetTypeDisplayString: String;
    currentValuationDisplayString: String;
    currentValuation: Number;
    color: String;
    imageName: String;

    constructor(currencyFormatter: CurrencyFormatter, kind: String, currentValuation: Number) {
        this.kind = kind;
        this.currentValuation = currentValuation;
        this.assetTypeDisplayString = AssetTypeUtils.getAssetTypeText(kind);
        this.currentValuationDisplayString = '₹' + currencyFormatter.currencyFormatter(currentValuation)
        this.imageName = AssetTypeUtils.getAssetTypeImageName(kind);
        this.color = AssetTypeUtils.getColorCode(kind);
     }

}

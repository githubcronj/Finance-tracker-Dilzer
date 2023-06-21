import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { LiabilityTypeUtils } from '../../../../../../model/enum/liability-type.enum'

export class LiabilitiesTypeViewModel {

    kind: String;
    liabilityTypeDisplayString: String;
    currentValuationDisplayString: String;
    currentValuation: Number;
    color: String;
    imageName: String;

    constructor(currencyFormatter: CurrencyFormatter, kind: String, currentValuation: Number) {
        this.kind = kind;
        this.currentValuation = currentValuation;
        this.liabilityTypeDisplayString = LiabilityTypeUtils.getLiabilityTypeText(kind);
        this.currentValuationDisplayString = '₹' + currencyFormatter.currencyFormatter(currentValuation)
        this.imageName = LiabilityTypeUtils.getLiabilityTypeImageName(kind);
        this.color = LiabilityTypeUtils.getColorCode(kind);
    }

}

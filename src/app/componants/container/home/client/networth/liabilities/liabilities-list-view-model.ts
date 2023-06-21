import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { LiabilityTypeUtils } from '../../../../../../model/enum/liability-type.enum';
import { Liability } from '../../../../../../model/liability/liability';
import { Client } from '../../../../../../model/client';


export class LiabilitiesListViewModel {

    liability: Liability;
    liabilityTypeDisplayString: String;
    outstandingLoanAmountDisplayString: String;
    imageName: String;
    rateOfInterestDisplayString;
    emiPayableDisplayString;
    createdDateDisplayString: String;
    isSelectedForDelete: Boolean;
    currentOutstandingAmount: Number;
    emiPayable: Number;
    ownerName: String;

    constructor(currencyFormatter: CurrencyFormatter, liability: Liability,ownerOfResourceList) {
        this.liability = liability;
        this.liabilityTypeDisplayString = LiabilityTypeUtils.getLiabilityTypeText(liability.kind);
        this.currentOutstandingAmount = liability.currentStage.outStandingAmount;
        this.outstandingLoanAmountDisplayString = '₹' + currencyFormatter.currencyFormatter(liability.currentStage.outStandingAmount);
        this.imageName = LiabilityTypeUtils.getLiabilityTypeImageName(liability.kind);
        this.rateOfInterestDisplayString = liability.rateOfInterest + ' %';
        this.emiPayable = liability.currentStage.emiPaid;
        this.emiPayableDisplayString = '₹' + currencyFormatter.currencyFormatter(liability.currentStage.emiPaid)
        this.createdDateDisplayString = liability.createdDateDisplayString();
        this.ownerName = this.getOwnerName(ownerOfResourceList, liability.owners)
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

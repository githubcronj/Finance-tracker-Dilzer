import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { IncomeTypeUtils } from '../../../../../../model/enum/income-type.enum';
import { Income } from '../../../../../../model/income/income';

export class IncomeListItemViewModel {

    income: Income;
    incomeTypeDisplayString: String;
    amountDisplayString: String;
    imageName: String;
    createdDateDisplayString: String;
    isSelectedForDelete: Boolean;
    growthRateDisplayString: String;
    ownerName: String;

    constructor(currencyFormatter: CurrencyFormatter, income: Income, ownerOfResourceList) {
        this.income = income;
        this.incomeTypeDisplayString = IncomeTypeUtils.getIncomeTypeText(income.kind);
        this.amountDisplayString = '₹' + currencyFormatter.currencyFormatter(income.amount)
        this.imageName = IncomeTypeUtils.getIncomeTypeImageName(income.kind);
        this.createdDateDisplayString = income.createdDateDisplayString();
        this.growthRateDisplayString = income.growthRate + ' %';
        this.ownerName = this.getOwnerName(ownerOfResourceList, income.owners)

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

import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { IncomeTypeUtils } from '../../../../../../model/enum/income-type.enum';


export class IncomeCategoryTypeViewModel {


    public title: String;
    public kind: String
    public incomeTypeDisplayString: String;
    public amountDisplayString: String;
    public amount: Number;
    public color: String;
    public imageName: String;


    constructor(currencyFormatter: CurrencyFormatter, kind: String, amount: Number) {
        this.kind = kind;
        this.amount = amount;
        this.incomeTypeDisplayString = IncomeTypeUtils.getIncomeTypeText(kind);
        this.amountDisplayString = '₹' + currencyFormatter.currencyFormatter(amount);
        this.imageName = IncomeTypeUtils.getIncomeTypeImageName(kind);
        this.color = IncomeTypeUtils.getColorCode(kind);
    }


    public toString() {
        return this.incomeTypeDisplayString;
    }

}
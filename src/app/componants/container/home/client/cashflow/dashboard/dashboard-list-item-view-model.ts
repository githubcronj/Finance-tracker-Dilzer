import { CurrencyFormatter } from '../../../../../../core/currency-formatter';


export class DashboardListItemViewModel {


    title: String;
    percentage: String;
    amount: Number;
    amountDisplayString: String;
    color: String;


    constructor(currencyFormatter: CurrencyFormatter, title: String, percentage: Number, amount: Number, color: String) {
        this.title = title;
        this.percentage = percentage.toFixed(2).toString() + " %";
        this.amount = amount;
        this.amountDisplayString = '₹' + currencyFormatter.currencyFormatter(amount);
        this.color = color;
    }


    toString() {
        return this.title + " (" + this.percentage + ")";
    }

}
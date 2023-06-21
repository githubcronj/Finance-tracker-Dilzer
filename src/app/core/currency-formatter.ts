export class CurrencyFormatter {

    constructor() {}


    currencyFormatter(amount) {
        return amount.toLocaleString('en-IN');
    }
}
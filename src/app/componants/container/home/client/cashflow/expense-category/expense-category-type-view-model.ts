import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { ExpenseTypeUtils } from '../../../../../../model/enum/expense/expense-type.enum';


export class ExpenseCategoryTypeViewModel {


    public title: String;
    public kind: String;
    public expenseTypeDisplayString: String;
    public currentLivingExpensesDisplayString: String;
    public earlyRetirementExpensesDisplayString: String;
    public lateRetirementExpensesDisplayString: String;
    public currentLivingExpenses: Number;
    public earlyRetirementExpenses: Number;
    public lateRetirementExpenses: Number;
    public color: String;
    public imageName: String;


    constructor(currencyFormatter: CurrencyFormatter, kind: String, currentLivingExpenses: Number, earlyRetirementExpenses: Number, lateRetirementExpenses: Number) {
        this.kind = kind;
        this.currentLivingExpenses = currentLivingExpenses;
        this.earlyRetirementExpenses = earlyRetirementExpenses;
        this.lateRetirementExpenses = lateRetirementExpenses;
        this.currentLivingExpensesDisplayString = '₹' + currencyFormatter.currencyFormatter(currentLivingExpenses);
        this.earlyRetirementExpensesDisplayString = '₹' + currencyFormatter.currencyFormatter(earlyRetirementExpenses);
        this.lateRetirementExpensesDisplayString = '₹' + currencyFormatter.currencyFormatter(lateRetirementExpenses);
        this.imageName = ExpenseTypeUtils.getExpenseTypeImageName(kind);
        this.expenseTypeDisplayString = ExpenseTypeUtils.getExpenseTypeText(kind);
        this.color = ExpenseTypeUtils.getColorCode(kind);
    }

    
    public toString() {
        return this.expenseTypeDisplayString;
    }

}
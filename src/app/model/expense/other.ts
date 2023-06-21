import { Expense } from './expense';
import { OtherExpenseSubTypeUtils } from '../enum/expense/other-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class OtherExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.OtherExpense)
    }

    subTypesOptions() {
        return OtherExpenseSubTypeUtils.getAllOtherExpensesSubType()
    }

    subtypeDisplayName() {
        return OtherExpenseSubTypeUtils.getOtherSubTypeText(this.subtype);
    }
}







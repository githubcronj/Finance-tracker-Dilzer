import { Expense } from './expense';
import { UtilityExpenseSubtypeTypeUtils } from '../enum/expense/utilities-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class UtilityExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.UtilityExpense)
    }

    subTypesOptions() {
        return UtilityExpenseSubtypeTypeUtils.getAllUtilityExpenseSubType()
    }

    subtypeDisplayName() {
        return UtilityExpenseSubtypeTypeUtils.getUtilityExpenseSubTypeText(this.subtype);
    }
}
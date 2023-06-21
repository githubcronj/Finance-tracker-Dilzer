import { Expense } from './expense';
import { MiscellaneousExpenseSubTypeTypeUtils } from '../enum/expense/miscellaneous-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class MiscellaneousExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.MiscellaneousExpense)
    }

    subTypesOptions() {
        return MiscellaneousExpenseSubTypeTypeUtils.getAllMiscellaneousExpenseSubType()
    }

    subtypeDisplayName() {
        return MiscellaneousExpenseSubTypeTypeUtils.getMiscellaneousExpenseSubTypeText(this.subtype);
    }
}
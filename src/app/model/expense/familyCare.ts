import { Expense } from './expense';
import { FamilyCareExpenseSubTypeUtils } from '../enum/expense/family-care-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class FamilyCareExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.FamilyCareExpense)
    }

    subTypesOptions() {
        return FamilyCareExpenseSubTypeUtils.getAllFamilyCareExpenseSubType()
    }

    subtypeDisplayName() {
        if (this.subtype) {
            return FamilyCareExpenseSubTypeUtils.getFamilyCareExpenseSubTypeText(this.subtype);
        }
    }
}
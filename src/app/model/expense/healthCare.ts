import { Expense } from './expense';
import { HealthCareExpenseSubtypeTypeUtils } from '../enum/expense/health-care-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class HealthCareExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.HealthCareExpense)
    }

    subTypesOptions() {
        return HealthCareExpenseSubtypeTypeUtils.getAllHealthCareExpenseSubType()
    }
    subtypeDisplayName() {
        return HealthCareExpenseSubtypeTypeUtils.getHealthCareExpenseSubTypeText(this.subtype);
    }
}
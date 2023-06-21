import { Expense } from './expense';
import { HousingExpenseSubtypeTypeUtils } from '../enum/expense/housing-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class HousingExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.HousingExpense)
    }

    subTypesOptions() {
        return HousingExpenseSubtypeTypeUtils.getAllHousingExpenseSubType()
    }
    
    subtypeDisplayName() {
        return HousingExpenseSubtypeTypeUtils.getHousingExpenseSubTypeText(this.subtype);
    }
}
import { Expense } from './expense';
import { FoodExpenseSubtypeTypeUtils } from '../enum/expense/food-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class FoodExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.FoodExpense)
    }

    subTypesOptions() {
        return FoodExpenseSubtypeTypeUtils.getAllFoodExpenseSubType()
    }
    subtypeDisplayName() {
        if (this.subtype) {
            return FoodExpenseSubtypeTypeUtils.getFoodExpenseSubTypeText(this.subtype);
        }
    }
}


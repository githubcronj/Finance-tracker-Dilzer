import { Expense } from './expense';
import { RecreationExpenseSubTypeUtils } from '../enum/expense/recreation-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class RecreationExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.RecreationExpense)
    }
    
    subTypesOptions(){
        return RecreationExpenseSubTypeUtils.getAllRecreationExpenseSubType()
    }

    subtypeDisplayName() {
        return RecreationExpenseSubTypeUtils.getRecreationExpenseSubTypeText(this.subtype);
    }

}
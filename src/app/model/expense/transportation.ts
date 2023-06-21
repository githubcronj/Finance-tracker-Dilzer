import { Expense } from './expense';
import { TransportationExpenseSubTypeUtils } from '../enum/expense/transportation-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class TransportationExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.TransportationExpense)
    }

    subTypesOptions() {
        return TransportationExpenseSubTypeUtils.getAllTransportationExpenseSubType()
    }

    subtypeDisplayName() {
        return TransportationExpenseSubTypeUtils.getTransportationExpenseSubTypeText(this.subtype);
    }
}
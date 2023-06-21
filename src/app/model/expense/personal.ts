import { Expense } from './expense';
import { PersonalExpenseSubtypeTypeUtils } from '../enum/expense/personal-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class PersonalExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.PersonalExpense)
    }

    subTypesOptions() {
        return PersonalExpenseSubtypeTypeUtils.getAllPersonalExpenseSubType()
    }

    subtypeDisplayName() {
        return PersonalExpenseSubtypeTypeUtils.getPersonalExpenseSubTypeText(this.subtype);
    }
}
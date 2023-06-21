import { Expense } from './expense';
import { PetExpenseSubTypeTypeUtils } from '../enum/expense/pet-expenses-sub-type.enum';
import { ExpenseType } from '../enum/expense/expense-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class PetExpense extends Expense {

    constructor() {
        super()
        this.kind = String(ExpenseType.PetExpense)
    }

    subTypesOptions() {
        return PetExpenseSubTypeTypeUtils.getAllPetExpenseSubType()
    }

    subtypeDisplayName() {
        return PetExpenseSubTypeTypeUtils.getPetExpenseSubTypeText(this.subtype);
    }
}
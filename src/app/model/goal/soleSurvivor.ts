import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { SoleSurvivorExpense } from './soleSurvivorExpense';
import { DatePipe } from '@angular/common';

@JsonObject
export class SoleSurvivor {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("inflationRate", Number) inflationRate: number = undefined
    @JsonProperty("amountBreakdownType", Number) amountBreakdownType: number = undefined
    @JsonProperty("typeOfExpense", Number) typeOfExpense: number = undefined
    @JsonProperty("expensesCopiedFrom", Number) expensesCopiedFrom: number = undefined
    @JsonProperty("soleSurvivorExpenseStartDate", Date) soleSurvivorExpenseStartDate: Date = undefined
    @JsonProperty("soleSurvivorExpenseEndDate", Date) soleSurvivorExpenseEndDate: Date = undefined
    @JsonProperty("soleSurvivorExpenses", [SoleSurvivorExpense]) soleSurvivorExpenses: SoleSurvivorExpense[] = []
    

    createSoleSurvivorExpenseStartDateDisplayString() {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.soleSurvivorExpenseStartDate, 'dd/MM/yyyy');
    }

    createSoleSurvivorExpenseEndDateDisplayString() {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.soleSurvivorExpenseEndDate, 'dd/MM/yyyy');
    }


}


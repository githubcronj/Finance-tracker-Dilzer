import { Income } from './income';
import { IncomeType } from '../enum/income-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class NetSalaryIncome extends Income {

    constructor() {
        super()
        this.kind = String(IncomeType.NetSalaryIncome)
    }

}
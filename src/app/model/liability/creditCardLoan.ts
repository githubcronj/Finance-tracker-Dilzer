import { Liability } from './liability';
import { LiabilityType } from '../enum/liability-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class CreditCardLoan extends Liability {

    constructor() {
        super()
        this.kind = String(LiabilityType.CreditCardLoan)
    }

}
import { Goal } from './goal';
import { GoalType } from '../enum/goal-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class ChildGraduation extends Goal {

    constructor() {
        super()
        this.kind = String(GoalType.ChildGraduation)
    }

}

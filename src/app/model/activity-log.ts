import { User } from './user';
import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";

@JsonObject
export class ActivityLog {

    @JsonProperty("dateOfActivity", Date) dateOfActivity: Date = undefined
    @JsonProperty("description", Number) description: number = undefined

}
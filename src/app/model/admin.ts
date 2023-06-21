import { User } from './user';
import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";

@JsonObject
export class Admin extends User {

    @JsonProperty("role", Number) role: number = undefined
    @JsonProperty("active", Boolean) active: boolean = undefined
    @JsonProperty("qualification", String) qualification: string = undefined
    @JsonProperty("certification", String) certification: string = undefined
    @JsonProperty("doj", Date) doj: Date = undefined

}
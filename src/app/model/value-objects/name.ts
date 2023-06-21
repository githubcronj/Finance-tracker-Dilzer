
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Name {
        @JsonProperty("firstName", String) firstName: string = undefined
        @JsonProperty("lastName", String) lastName: string = undefined

        fullName() {

                if (this.firstName != null && this.lastName != null) {
                        return this.firstName + ' ' + this.lastName
                } else {
                        return this.firstName
                }
        }

}
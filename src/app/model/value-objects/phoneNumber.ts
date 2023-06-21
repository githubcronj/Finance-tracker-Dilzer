import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class PhoneNumber {

    @JsonProperty("isd", String) isd: string = undefined
    @JsonProperty("std", String) std: string = undefined;
    @JsonProperty("ph", String) ph: string = undefined;

    displayPhoneNumber() {

        if (this.std != null) {
            this.isd = null
        }
        if (this.isd != null && this.ph != null) {
            return this.isd + ' ' + this.ph;
        } else if (this.std != null && this.ph != null) {

            return this.std + ' ' + this.ph;
        } else if (this.ph != null) {
            return this.ph;
        } else {
            return '';
        }
    }

}
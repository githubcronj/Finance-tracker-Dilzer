import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Address {

    @JsonProperty("addressLine1", String) addressLine1: string = undefined
    @JsonProperty("addressLine2", String) addressLine2: string = undefined
    @JsonProperty("locality", String) locality: string = undefined
    @JsonProperty("city", String) city: string = undefined
    @JsonProperty("pincode", Number) pincode: number = undefined
    @JsonProperty("country", String) country: string = undefined


    displayFullAddress() {
        let fullAddress = '';
        if (this.addressLine1 != null) {
            fullAddress = this.addressLine1 + '<br/>';
        }
        if (this.addressLine2 != null) {
            fullAddress += this.addressLine2 + '<br/>';
        }
        if (this.locality != null) {
            fullAddress += this.locality + ' ';
        }
        if (this.city != null) {
            fullAddress += this.city + ' ';
        }
        if (this.pincode != null) {
            fullAddress += this.pincode + '<br/>';
        }
        if (this.country != null) {
            fullAddress += this.country;
        }
        return fullAddress.replace(/,\s*$/, '');
    }
}

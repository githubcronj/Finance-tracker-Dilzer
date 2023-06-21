import { Name } from './value-objects/name';
import { PhoneNumber } from './value-objects/phoneNumber';
import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';


@JsonObject
export class User {

    @JsonProperty("_id", String) _id: string = undefined;
    @JsonProperty("name", Name) name: Name = new Name();
    @JsonProperty("email", String) email: string = undefined;
    @JsonProperty("kind", String) kind: string = undefined;
    @JsonProperty("ph", PhoneNumber) ph: PhoneNumber = new PhoneNumber();
    @JsonProperty("landline", PhoneNumber) landline: PhoneNumber = new PhoneNumber();
    @JsonProperty("dob", Date) dob: Date = undefined;
    isSelected = false;

    static discriminatorInfo = { key: "kind", subclasses: { "Admin": "Admin", "Client": "Client" } }

    duplicate() {

        let parser = new JsonConvert()
        let jsonObject = parser.serialize(this)
        let duplicate = parser.deserialize(jsonObject, User)
        return duplicate
    }
}
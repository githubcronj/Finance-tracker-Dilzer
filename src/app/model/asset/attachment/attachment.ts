import { JsonObject, JsonProperty } from "../../parsers/json-convert-decorators";
import { JsonConvert } from '../../../model/parsers/json-convert';


@JsonObject
export class Attachment {
    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("originalname", String) originalname: string = undefined
    @JsonProperty("mimetype", String) mimetype: string = undefined
    @JsonProperty("contentType", String) contentType: string = undefined
    @JsonProperty("location", String) location: string = undefined
    @JsonProperty("key", String) key: string = undefined
}
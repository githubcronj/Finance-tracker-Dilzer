import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';
import { JsonConvert } from '../../model/parsers/json-convert';


@JsonObject
export class RiskProfileAnswer {

    @JsonProperty('user_id', Number) user_id: number = undefined
    @JsonProperty('answer_type', String) answer_type: string = undefined
    @JsonProperty('question_id', Number) question_id: number = undefined
    answer: any;

}

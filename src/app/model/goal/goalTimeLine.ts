import { JsonObject, JsonProperty } from "./../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { TimeRange } from '../timeRange';
import { DatePipe } from '@angular/common';

@JsonObject
export class GoalTimeLine extends TimeRange {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined

    createdDateDisplayString() {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.startDate, 'dd/MM/yyyy');
    }

}
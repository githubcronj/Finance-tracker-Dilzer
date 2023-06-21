import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { Client } from '../client';
import { DatePipe } from '@angular/common';
import { DatePickerType } from '../../componants/container/date-picker/date-picker.enum';

@JsonObject
export class EventDate {

    @JsonProperty("type", Number) type: number = undefined
    @JsonProperty("date", Date) date: Date = undefined
    @JsonProperty("age", Number) age: number = undefined
    @JsonProperty("ageMember", String) ageMember: string = undefined
    @JsonProperty("retirementMember", String) retirementMember: string = undefined
    @JsonProperty("expiryMember", String) expiryMember: string = undefined
    @JsonProperty("retirementIndex", Number) retirementIndex: number = undefined
    @JsonProperty("expiryIndex", Number) expiryIndex: number = undefined


    projectedStartDate(client: Client): Date {

        if (this.type == DatePickerType.ByDate) {            
            return this.date       
        } else if (this.type == DatePickerType.ByAge) {
            let info = client.memberInfo(this.ageMember)
            if (info == null) {
                return undefined
            }

            const age = new Date(info.dob);
            return new Date(age.setFullYear(age.getFullYear() + Number(this.age)));

        } else if (this.type == DatePickerType.ByRetirementAge) {
            
            let info = client.memberInfo(this.retirementMember)
            if (info == null) {
                return undefined
            }
            const age = new Date(info.dob);
            return new Date(age.setFullYear(age.getFullYear() + info.retirementAge + Number(this.retirementIndex)));
            
        } else {
            
            let info = client.memberInfo(this.expiryMember)
            if (info == null) {
                return undefined
            }
            const lifeExpectancy = new Date(info.dob);
            return new Date(lifeExpectancy.setFullYear(lifeExpectancy.getFullYear() + info.lifeExpectancy + Number(this.expiryIndex)));
            
        }
    }

}

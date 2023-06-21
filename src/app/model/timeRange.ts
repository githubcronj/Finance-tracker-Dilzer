import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';
import { EventDate } from './value-objects/eventDate';
import { Client } from './client';
import { DatePipe } from '@angular/common';
import { DatePickerType } from '../componants/container/date-picker/date-picker.enum';


@JsonObject
export class TimeRange {

    @JsonProperty("startDate", EventDate) startDate: EventDate = undefined
    @JsonProperty("endDate", EventDate) endDate: EventDate = undefined


    private displayStringForIndexedEntry(client: Client, member: string, index: number, prefix: string, placeholder: string, displayYear: number) {
        let displayString = ""
        let info = client.memberInfo(member)
        if (info == null) {
            return ""
        }

        if (index == 0) {
            displayString = prefix + `when ${info.name} ${placeholder} (${displayYear})`
        } else {
            let years = "years"
            if (index == -1 || index == 1) {
                years = "year"
            }
            if (index < 0) {
                years = years + " before"
            } else {
                years = years + " after"
            }
            displayString = prefix + `${Math.abs(index)} ${years} ${info.name} ${placeholder} (${displayYear})`
        }

        return displayString
    }

    displayString(client: Client) {

        const datePipe = new DatePipe('en-US');

        let displayString = ""

        if (this.startDate.type == DatePickerType.ByDate) {

            let prefix = "in"
            if (this.endDate) {
                prefix = "from";
            }

            displayString = `${prefix} ${datePipe.transform(this.startDate.date, 'dd/MM/yyyy')}`;

        } else if (this.startDate.type == DatePickerType.ByAge) {

            let info = client.memberInfo(this.startDate.ageMember)
            if (info == null) {
                return ""
            }

            let prefix = "when"
            if (this.endDate) {
                prefix = "from when";
            }

            let year = info.dob.getFullYear() + Number(this.startDate.age)
            displayString = `${prefix} ${info.name} is ${this.startDate.age} (${year})`;

        } else if (this.startDate.type == DatePickerType.ByRetirementAge) {

            let prefix = ""
            if (this.endDate) {
                prefix = "from ";
            }

            let retirementYear = Number(this.startDate.retirementIndex) + client.dob.getFullYear() + client.retirementAge
            displayString = this.displayStringForIndexedEntry(client, this.startDate.retirementMember, this.startDate.retirementIndex, prefix, "retires", retirementYear)

        } else {

            let prefix = ""
            if (this.endDate) {
                prefix = "from ";
            }

            let lifeExpectancyYear = Number(this.startDate.expiryIndex) + client.dob.getFullYear() + client.lifeExpectancy
            displayString = this.displayStringForIndexedEntry(client, this.startDate.expiryMember, this.startDate.expiryIndex, prefix, "expires", lifeExpectancyYear)

        }


        if (this.endDate) {

            if (this.endDate.type == DatePickerType.ByDate) {
                displayString = displayString + " until " + datePipe.transform(this.endDate.date, 'dd/MM/yyyy');
            } else if (this.endDate.type == DatePickerType.ByAge) {

                let info = client.memberInfo(this.endDate.ageMember)
                if (info == null) {
                    return ""
                }

                let year = info.dob.getFullYear() + Number(this.endDate.age)
                displayString = displayString + ` until ${info.name} is ${this.endDate.age}  (${year})`;

            } else if (this.endDate.type == DatePickerType.ByRetirementAge) {

                let retirementYear = Number(this.endDate.retirementIndex) + client.dob.getFullYear() + client.retirementAge
                displayString = displayString + this.displayStringForIndexedEntry(client, this.endDate.retirementMember, this.endDate.retirementIndex, " until ", "retires", retirementYear)

            } else if (this.endDate.type == DatePickerType.ByEndOfLoan) {

                displayString = displayString + " until loan is payed off in full."
            } else {

                let lifeExpectancyYear = Number(this.endDate.expiryIndex) + client.dob.getFullYear() + client.lifeExpectancy
                displayString = displayString + this.displayStringForIndexedEntry(client, this.endDate.expiryMember, this.endDate.expiryIndex, " until ", " reaches life expectancy", lifeExpectancyYear)

            }
        }

        return displayString

    }


}
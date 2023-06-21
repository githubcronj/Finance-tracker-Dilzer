import { JsonObject, JsonProperty } from "./parsers/json-convert-decorators";
import { JsonConvert } from '../model/parsers/json-convert';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from './enum/asset/committed-saving-frequency.enum'
import { EventDate } from './value-objects/eventDate';
import { Client } from './client';
import { DatePipe } from '@angular/common';
import { DatePickerType } from '../componants/container/date-picker/date-picker.enum';
import { CommittedPayment } from './committedPayment';
import { FormatterService } from 'app/services/formatter.service';


@JsonObject
export class CommittedSaving extends CommittedPayment {
    formatter = new FormatterService()

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);
     
       }

}
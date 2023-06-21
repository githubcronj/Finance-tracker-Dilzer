import { Name } from './value-objects/name';
import { PhoneNumber } from './value-objects/phoneNumber';
import { Address } from './value-objects/address';
import { Gender, GenderUtils } from './enum/gender.enum';
import { ClientTypeUtils } from './enum/client-type.enum';
import { MaritalStatusUtils } from './enum/marital-status.enum';
import { ResidentialStatus, ResidentialStatusUtils } from './enum/residential_status.enum';
import { Title } from './enum/title.enum';
import { HealthHistory } from './value-objects/healthHistory';
import { JsonObject, JsonProperty } from './parsers/json-convert-decorators';
import { DatePipe } from '@angular/common';

@JsonObject
export class Spouse {

    @JsonProperty("_id", String) _id: string = undefined;    
    @JsonProperty('name', Name) name: Name = new Name();
    @JsonProperty('dob', Date) dob: Date = undefined;
    @JsonProperty('residentialStatus', Number) residentialStatus: number = undefined;
    @JsonProperty('ph', PhoneNumber) ph: PhoneNumber = new PhoneNumber();
    @JsonProperty('email', String) email: string = undefined;
    @JsonProperty('pan', String) pan: string = undefined;
    @JsonProperty('employerName', String) employerName: string = undefined;
    @JsonProperty('companyAddress', Address) companyAddress: Address = new Address();
    @JsonProperty('title', Number) title: number = undefined;
    @JsonProperty('gender', Number) gender: number = undefined;
    @JsonProperty('retirementAge', Number) retirementAge: number = undefined;
    @JsonProperty('lifeExpectancy', Number) lifeExpectancy: number = undefined;
    @JsonProperty('isPrimaryEarner', Boolean) isPrimaryEarner: boolean = undefined;
    @JsonProperty('healthHistory', HealthHistory) healthHistory: HealthHistory = new HealthHistory();
    @JsonProperty('joiningDate', Date) joiningDate: Date = undefined;
    


    displayGender() {
        return GenderUtils.getGenderText(this.gender);
    }

    displayResidentialStatus() {
        return ResidentialStatusUtils.getResidentialStatusText(this.residentialStatus);
    }

    displayDOB() {
        if (this.dob != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.dob, 'dd/MM/yyyy');
        }
    }
}

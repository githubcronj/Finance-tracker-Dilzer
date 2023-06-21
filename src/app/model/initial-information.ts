import { Name } from './value-objects/name';
import { Address } from './value-objects/address';
import { SocialProfile } from './value-objects/social-profile';
import { PhoneNumber } from './value-objects/phoneNumber';
import { Reference } from './value-objects/reference';
import { FinancialAsset } from './value-objects/finanacialAsset';
import { MaritalStatus, MaritalStatusUtils } from './enum/marital-status.enum';
import { FinancialAssetUtils } from './enum/financial-asset.enum';
import { ServiceObjectiveUtils } from './enum/service-objective.enum';
import { HearAboutUsUtils } from './enum/hear-about-us.enum';
import { JsonObject, JsonProperty } from './parsers/json-convert-decorators';
import { DatePipe } from '@angular/common';


@JsonObject
export class InitialInformation {

    @JsonProperty('name', Name) name: Name = new Name();
    @JsonProperty('dob', Date) dob: Date = undefined;
    @JsonProperty('maritalStatus', Number) maritalStatus: MaritalStatus = MaritalStatus.Single;
    @JsonProperty('spouseName', Name) spouseName: Name = new Name();
    @JsonProperty('objective', [Number]) objective: Array<number> = [];
    @JsonProperty('reference', [Reference]) reference: Array<Reference> = [];
    @JsonProperty('companyName', String) companyName: string = undefined;
    @JsonProperty('companyAddress', Address) companyAddress: Address = new Address();
    @JsonProperty('currency', String) currency: string = undefined;
    @JsonProperty('jobType', String) jobType: string = undefined;
    @JsonProperty('jobDescription', String) jobDescription: string = undefined;
    @JsonProperty('incomeSources', String) incomeSources: string = undefined;
    @JsonProperty('numberOfDependents', Number) numberOfDependents: number = undefined;
    @JsonProperty('approximateNetIncome', Number) approximateNetIncome: number = undefined;
    @JsonProperty('residentialAddress', Address) residentialAddress: Address = new Address();
    @JsonProperty('selfOccupiedProperty', Boolean) selfOccupiedProperty: boolean = undefined;
    @JsonProperty('assets', [FinancialAsset]) assets: Array<FinancialAsset> = [];
    @JsonProperty('bestFinancialDecision', String) bestFinancialDecision: string = undefined;
    @JsonProperty('worstFinancialDecision', String) worstFinancialDecision: string = undefined;
    @JsonProperty('officialEmail', String) officialEmail: string = undefined;
    @JsonProperty('email', String) email: string = undefined;
    @JsonProperty('ph', PhoneNumber) ph: PhoneNumber = new PhoneNumber();
    @JsonProperty('socialProfiles', [SocialProfile]) socialProfiles: Array<SocialProfile> = [];

    displayDOB() {
        if (this.dob != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.dob, 'dd/MM/yyyy');
        }
    }

    displayMaritalStatus() {

        if (this.maritalStatus != null) {
            return MaritalStatusUtils.getMaritalStatusText(Number(this.maritalStatus));
        }
    }

    displayNetAmount() {
        if (this.approximateNetIncome != null && this.currency) {
            return this.approximateNetIncome + ' ' + this.currency;
        } else {
            return this.approximateNetIncome;
        }
    }

    displayFinancialAssets(assetNumber) {
        return FinancialAssetUtils.getFinancialAssetText(assetNumber);
    }

    displayServiceObjectives(objectiveNumber) {
        return ServiceObjectiveUtils.getServiceObjectiveText(objectiveNumber);
    }

    displayReferenceFrom(referenceNumber) {
        return HearAboutUsUtils.getHearAboutUsText(referenceNumber);
    }

}
import { User } from './user';
import { Spouse } from './spouse';
import { Admin } from './admin';
import { FamilyMembers } from './family-members';
import { Address } from './value-objects/address';
import { HealthHistory } from './value-objects/healthHistory';
import { InitialInformation } from './initial-information';
import { Gender, GenderUtils } from './enum/gender.enum';
import { ClientType, ClientTypeUtils } from './enum/client-type.enum';
import { MaritalStatus, MaritalStatusUtils } from './enum/marital-status.enum';
import { ResidentialStatus, ResidentialStatusUtils } from './enum/residential_status.enum';
import { Title } from './enum/title.enum';
import { RiskProfile } from './riskProfile/riskProfile';
import { JsonObject, JsonProperty } from './parsers/json-convert-decorators';
import { Stages, StagesUtils } from './enum/stages.enum';
import { DatePipe } from '@angular/common';
import { TeamMemberRole } from './enum/team-member-role.enum';
import { ActivityLog } from './activity-log';


@JsonObject
export class Client extends User {

    @JsonProperty('workFlowStage', Number) workFlowStage: number = undefined;
    @JsonProperty('initialInformation', InitialInformation) initialInformation: InitialInformation = undefined;
    @JsonProperty('riskProfile', RiskProfile) riskProfile: RiskProfile = new RiskProfile();
    @JsonProperty('clientType', Number) clientType: number = undefined;
    @JsonProperty('maritalStatus', Number) maritalStatus: number = undefined;
    @JsonProperty('residentialStatus', Number) residentialStatus: number = undefined;
    @JsonProperty('residentialAddress', Address) residentialAddress: Address = new Address();
    @JsonProperty('pan', String) pan: string = undefined;
    @JsonProperty('employerName', String) employerName: string = undefined;
    @JsonProperty('companyAddress', Address) companyAddress: Address = new Address();
    @JsonProperty('gender', Number) gender: number = undefined;
    @JsonProperty('title', Number) title: number = undefined;
    @JsonProperty('spouse', Spouse) spouse: Spouse = new Spouse();
    @JsonProperty('familyMembers', [FamilyMembers]) familyMembers = [];
    @JsonProperty('retirementAge', Number) retirementAge: number = undefined;
    @JsonProperty('lifeExpectancy', Number) lifeExpectancy: number = undefined;
    @JsonProperty('healthHistory', HealthHistory) healthHistory: HealthHistory = new HealthHistory();
    @JsonProperty('admins', [String]) admins = [];
    @JsonProperty('expenseInflationRate', Number) expenseInflationRate: number = undefined;
    @JsonProperty("activityLog", [ActivityLog]) activityLog: ActivityLog[] = [];
    @JsonProperty("age", Number) age: number = undefined;
    @JsonProperty("salaryComponent", Number) salaryComponent: number = undefined;
    @JsonProperty("incomeFinal", Number) incomeFinal: number = undefined;
    @JsonProperty("yearsToRetire", Number) yearsToRetire: number = undefined;
    @JsonProperty("yearsSinceJoining", Number) yearsSinceJoining: number = undefined;
    @JsonProperty("serviceYears", Number) serviceYears: number = undefined; 
    @JsonProperty("retirementDate", Date) retirementDate: Date = undefined;
    @JsonProperty("joiningDate", Date) joiningDate: Date = undefined;
    @JsonProperty('growthRate', Number) growthRate: number = undefined;

    @JsonProperty('spouseName', String) spouseName: string = undefined;
    @JsonProperty('spouseDOB', Date) spouseDOB: Date = undefined;
    @JsonProperty('spouseRetirementAge', Number) spouseRetirementAge: number = undefined;
    @JsonProperty('spuseLifeExpectancy', Number) spuseLifeExpectancy: number = undefined;
    @JsonProperty('spouseGrowthRate', Number) spouseGrowthRate: number = undefined;
    @JsonProperty('spouseSalaryComponant', Number) spouseSalaryComponant: number = undefined;
    
    @JsonProperty("spouseYearsToRetire", Number) spouseYearsToRetire: number = undefined;
    @JsonProperty("spouseServiceYears", Number) spouseServiceYears: number = undefined;
    @JsonProperty("spouseIncomeFinal", Number) spouseIncomeFinal: number = undefined;
    @JsonProperty("spouseYearsSinceJoining", Number) spouseYearsSinceJoining: number = undefined;
    @JsonProperty("spouseRetirementDate", Date) spouseRetirementDate: Date = undefined;
    @JsonProperty("spouseJoiningDate", Date) spouseJoiningDate: Date = undefined;
    
    
    chiefFinancialPlanner: string
    paraPlanner: string
    operationalRelationshipManager: string
    researchRelationshipManager: string
    salesRelationshipManager: string

    riskProfileDisplayString() {

        let riskProfile = ""
        if (this.riskProfile["rate"]) {
            riskProfile = `${this.riskProfile["displayName"]} @ ${this.riskProfile["rate"]}%`
        }
        return riskProfile
    }

    displayGender() {
        return GenderUtils.getGenderText(this.gender);
    }

    displayClientType() {
        return ClientTypeUtils.getClientTypeText(this.clientType);
    }

    displayMaritalStatus() {
        return MaritalStatusUtils.getMaritalStatusText(this.maritalStatus);
    }

    displayResidentialStatus() {
        return ResidentialStatusUtils.getResidentialStatusText(this.residentialStatus);
    }


    displayStage() {
        return StagesUtils.getStagesText(this.workFlowStage);
    }

    displayDOB() {
        if (this.dob != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.dob, 'dd/MM/yyyy');
        }
    }

    isProspect() {

        if (this.workFlowStage >= Stages.DataCollection) {
            return false
        } else {
            return true
        }

    }

    mapPlannerRoles(allAdmins) {

        for (const adminId of this.admins) {


            const teamMember = allAdmins.find(tempAdmin => {
                return tempAdmin._id === adminId
            })
            if (teamMember) {
                if (teamMember.role == TeamMemberRole.ChiefFinancialPlanner) {
                    this.chiefFinancialPlanner = teamMember._id
                } else if (teamMember.role == TeamMemberRole.ParaPlanner || teamMember.role == TeamMemberRole.SeniorParaPlanner) {
                    this.paraPlanner = teamMember._id
                } else if (teamMember.role == TeamMemberRole.ResearchRelationshipManager) {
                    this.researchRelationshipManager = teamMember._id
                } else if (teamMember.role == TeamMemberRole.OperationalRelationshipManager) {
                    this.operationalRelationshipManager = teamMember._id
                } else if (teamMember.role == TeamMemberRole.SalesRelationshipManager) {
                    this.salesRelationshipManager = teamMember._id
                }
            }

        }
    }

    ownerOfResourceList() {
        const options = [];
        let together = '';
        if (this.name && this.name.firstName) {
            options.push({ key: this._id, value: this.name.fullName() });
            together += this.name.firstName;
        }
        if (this.spouse && this.spouse.name && this.spouse.name.firstName) {
            options.push({ key: this.spouse._id, value: this.spouse.name.fullName() });
            together += '&' + this.spouse.name.firstName;
        } else {
            together = '';
        }

        if (this.familyMembers && this.familyMembers.length > 0) {
            for (const familyMembers of this.familyMembers) {
                options.push({ key: familyMembers._id, value: familyMembers.name.firstName });
            }
        }

        if (this.spouse && this.spouse.name && this.spouse.name.firstName) {
            let name = this.name.firstName + " & " + this.spouse.name.firstName
            let key = this._id + "&" + this.spouse._id;
            options.push({ key: key, value: name })
        }
        return options;
    }

    allMembers(includeFamilyMembers) {
        const options = [];
        if (this.name && this.name.firstName) {
            options.push({ key: this._id, value: this.name.fullName() });
        }
        if (this.spouse && this.spouse.name && this.spouse.name.firstName) {
            options.push({ key: this.spouse._id, value: this.spouse.name.fullName() });
        }
        if (includeFamilyMembers) {
            if (this.familyMembers && this.familyMembers.length > 0) {
                for (const familyMembers of this.familyMembers) {
                    options.push({ key: familyMembers._id, value: familyMembers.name.fullName() });
                }
            }
        }
        return options;
    }


    memberInfo(id: String) {

        let dob = undefined
        let name = undefined
        let retirementAge = undefined
        let lifeExpectancy = undefined

        if (id == this._id) {

            dob = this.dob
            name = this.name.fullName()
            retirementAge = this.retirementAge
            lifeExpectancy = this.lifeExpectancy

        } else if (id == this.spouse._id) {
            dob = this.spouse.dob
            name = this.spouse.name.fullName()
            retirementAge = this.spouse.retirementAge
            lifeExpectancy = this.spouse.lifeExpectancy
        } else {

            for (let member of this.familyMembers) {
                if (id == member._id) {
                    dob = member.dob
                    name = member.name.fullName()
                    lifeExpectancy = member.lifeExpectancy
                }
            }
        }

        if (dob == undefined) {
            return null;
        }
        return { dob: dob, name: name, retirementAge: retirementAge, lifeExpectancy: lifeExpectancy }
    }
}

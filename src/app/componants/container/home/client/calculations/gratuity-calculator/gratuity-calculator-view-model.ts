import { Injectable } from '@angular/core';
import { UserRepository } from '../../../../../../repository/user/user.repository';
import { GratuityCalculatorRepository } from '../../../../../../repository/gratuity-calculator/gratuity-calculator.repository';
import { Client } from '../../../../../../model/client';
import { CompanyType, CompanyTypeUtils } from '../../../../../../model/enum/company-type.enum';
import { FormatterService } from 'app/services/formatter.service';
import { Income } from '../../../../../../model/income/income';
import { GratuityCalculatorComponent } from './gratuity-calculator.component';
import * as moment from 'moment';
import * as Finance from 'financial';
// import FinanceService from '../../../../../../services/finance.service';
// import FinanceService from '../../../../../../../../node_modules/financial/NaMeOfThEfIlE';lib/tvm.js

@Injectable()
export class GratuityCalculatorViewModel {

    private model;
    public gratuity = {
        'valuationDate': undefined,
        'ownerName': undefined,
        'dob': undefined,
        'age': undefined,
        'retirementAge': undefined,
        'retirementDate': undefined,
        'yearsToRetire': undefined,
        'dateOfJoinng': undefined,
        'companyType': undefined,
        'salaryComponant': undefined,
        'salaryComponantDuringRetirement': undefined,
        'growthRate': undefined,
        'currentExperience': undefined,
        'serviceYears': undefined,
        'gratuityPresentValue': undefined,
        'gratuityFutureValue': undefined,
        'gratuityPresentValueDisplayString': undefined,
        'gratuityFutureValueDisplayString': undefined,
        'initialOwnerName': undefined,
        'maxLimitExemption': undefined,
        'taxSlab': undefined,
        'taxableAmount': undefined,
        'taxToBePaid': undefined,
        'totalGratuity': undefined,
        'maxLimitExemptionDisplayString': undefined,
        'taxableAmountDisplayString': undefined,
        'taxToBePaidDisplayString': undefined,
        'totalGratuityDisplayString': undefined,
        
        'spouseValuationDate': undefined,
        'spouseOwnerName': undefined,
        'spousedob': undefined,
        'spouseAge': undefined,
        'spouseRetirementAge': undefined,
        'spouseRetirementDate': undefined,
        'spouseYearsToRetire': undefined,
        'spouseDateOfJoinng': undefined,
        'spouseCompanyType': undefined,
        'spouseSalaryComponant': undefined,
        'spouseSalaryComponantDuringRetirement': undefined,
        'spouseGrowthRate': undefined,
        'spouseCurrentExperience': undefined,
        'spouseServiceYears': undefined,
        'spouseGratuityPresentValue': undefined,
        'spouseGratuityFutureValue': undefined,
        'spouseGratuityPresentValueDisplayString': undefined,
        'spouseGratuityFutureValueDisplayString': undefined,
        'spouseInitialOwnerName': undefined,
        'spouseMaxLimitExemption': undefined,
        'spouseTaxSlab': undefined,
        'spouseTaxableAmount': undefined,
        'spouseTaxToBePaid': undefined,
        'spouseTotalGratuity': undefined,
        'spouseMaxLimitExemptionDisplayString': undefined,
        'spouseTaxableAmountDisplayString': undefined,
        'spouseTaxToBePaidDisplayString': undefined,
        'spouseTotalGratuityDisplayString': undefined,
    };
    public companyTypes = CompanyTypeUtils.getAllCompanyType();
    public userDetails: Client;
    public ownersList = [];
    public clientId;
    private ownerId;
    private initialCurrentExperience;
    private initialSpouseCurrentExperience;
    private initialServiceYears;
    private initialSpouseServiceYears;
    formatter = new FormatterService()

    constructor(
        private gratuityCalculatorRepository: GratuityCalculatorRepository,
        private userRepository: UserRepository
    ) {

    }

    async getUserDetails() {
        this.setGratuityValuesAsUndefined();
        try {
            this.userDetails = await this.userRepository.getClient(this.clientId);
        } catch (error) {
            throw error
        }
    }
    
    getOwnerList() {
        const options = [];
        let together = '';
        if (this.userDetails && this.userDetails.name && this.userDetails.name.firstName) {
            options.push({ key: this.userDetails.name.fullName(), value: this.userDetails._id });
            together += this.userDetails.name.firstName;
        }

        if (this.userDetails && this.userDetails.spouse && this.userDetails.spouse.name && this.userDetails.spouse.name.firstName) {
            options.push({ key: this.userDetails.spouse.name.fullName(), value: this.userDetails.spouse._id });
            together += '&' + this.userDetails.spouse.name.firstName;
        } else {
            together = '';
        }

        if (this.userDetails && this.userDetails.familyMembers && this.userDetails.familyMembers.length > 0) {
            for (const familyMembers of this.userDetails.familyMembers) {
                options.push({ key: familyMembers.name.firstName, value: familyMembers._id });
            }
        }
        this.ownersList = options;
    }


    getOwnerId() {
        const selectedOwner = this.ownersList.find(owner => owner.name == this.gratuity.ownerName);
        if (selectedOwner) {
            this.ownerId = selectedOwner.value;
        } else {
            this.ownerId = this.clientId;
        }
    }


    async getGratuity() {
        try {
            this.getOwnerId();
            this.model = await this.gratuityCalculatorRepository.getInitialGratuityData(this.clientId, this.ownerId);
            let user = this.model.user;
            this.userDetails = user;
            let income = this.model.income;
            
            this.userDetails.spouseName = user.spouse.name;
            this.userDetails.spouseDOB = user.spouse.dob;
            this.userDetails.spouseRetirementAge = user.spouse.retirementAge;
            this.userDetails.spuseLifeExpectancy = user.spouse.lifeExpectancy;
            this.userDetails.spouseGrowthRate = user.spouse.growthRate;
            this.userDetails.spouseSalaryComponant = user.spouse.salaryComponent;
            
            this.gratuity.ownerName = user.name.firstName+' '+user.name.lastName;
            this.gratuity.valuationDate = user.valuationDate;
            this.gratuity.spouseValuationDate = user.spouseValuationDate;
            this.gratuity.initialOwnerName = user.name;
            if (user.joiningDate){
                this.gratuity.dateOfJoinng = new Date(user.joiningDate);
            }
            if (user.spouse.joiningDate){
                this.gratuity.spouseDateOfJoinng = new Date(user.spouse.joiningDate);
            }
            if(user.dob){
                this.gratuity.dob = this.parseDate(user.dob);
            }
            this.gratuity.age = this.model.age;
            this.gratuity.growthRate = income.growthRate;
            this.gratuity.salaryComponant = Math.round(income.amount*income.frequency/12);
            this.gratuity.retirementAge = user.retirementAge;
            this.gratuity.retirementDate = user.retirementDate && this.parseDate(user.retirementDate);
            
            // this.gratuity.salaryComponantDuringRetirement = parseInt(this.model.incomeFinal);
            // this.gratuity.currentExperience = this.model.yearsSinceJoining;
            this.gratuity.serviceYears = this.model.yearsToRetire+this.model.yearsSinceJoining;
            this.gratuity.yearsToRetire = this.model.yearsToRetire;
            
            this.gratuity.companyType = this.companyTypes[user.companyType].value;
            this.gratuity.spouseCompanyType = this.companyTypes[user.spouse.companyType];
            
            this.gratuity.spouseOwnerName = user.spouse.name.firstName+' '+user.spouse.name.lastName;
            this.gratuity.spousedob = this.parseDate(user.spouse.dob);
            this.gratuity.spouseAge = this.model.spouseAge;
            this.gratuity.spouseRetirementAge = user.spouse.retirementAge;
            this.gratuity.spouseRetirementDate = this.parseDate(user.spouse.retirementDate);
            this.gratuity.spouseYearsToRetire = this.model.spouseYearsToRetire;
            this.gratuity.spouseSalaryComponant = user.spouse.salaryComponent;
            // this.gratuity.spouseSalaryComponantDuringRetirement = this.model.spouseIncomeFinal;
            this.gratuity.spouseGrowthRate = user.spouse.growthRate;
            // this.gratuity.spouseCurrentExperience = this.model.yearsSinceJoining;
            this.gratuity.spouseServiceYears = this.model.spouseYearsToRetire+this.model.yearsSinceJoining;
            this.dateOfJoiningSelected(this.gratuity.dateOfJoinng);
            this.spouseDateOfJoiningSelected(this.gratuity.spouseDateOfJoinng);
            this.gratuity.salaryComponantDuringRetirement = Math.round(this.FV(this.gratuity.growthRate,this.gratuity.yearsToRetire,1,-1*this.gratuity.salaryComponant,1));
            this.gratuity.spouseSalaryComponantDuringRetirement = Math.round(this.FV(this.gratuity.spouseGrowthRate,this.gratuity.spouseYearsToRetire,1,-1*this.gratuity.spouseSalaryComponant,1));
            
            let extraInfo = {
                age: this.gratuity.age,
                salaryComponent: this.gratuity.salaryComponant,

                incomeFinal: this.gratuity.salaryComponantDuringRetirement,
                yearsToRetire: this.gratuity.yearsToRetire,
                yearsSinceJoining: this.gratuity.currentExperience,
                serviceYears: this.gratuity.serviceYears,
                retirementDate: this.gratuity.retirementDate,
                growthRate: this.gratuity.growthRate,

                spouseIncomeFinal: this.gratuity.spouseSalaryComponantDuringRetirement,
                spouseYearsToRetire: this.gratuity.spouseYearsToRetire,
                spouseYearsSinceJoining: this.gratuity.spouseCurrentExperience,
                spouseServiceYears: this.gratuity.spouseServiceYears,
                spouseRetirementDate: this.gratuity.spouseRetirementDate,
                spouseGrowthRate: this.gratuity.spouseGrowthRate,
            }; 
            this.userDetails = Object.assign(extraInfo,this.userDetails);

        } catch (error) {
            throw error;
        }
    }

    maxLimitForExemptionEvent(event) {
        let maxLimit = Number(event.target.value);
        this.gratuity.taxableAmount = Math.round(this.gratuity.gratuityFutureValue - maxLimit);
        if (this.gratuity.taxSlab){
            this.gratuity.taxToBePaid = Math.round(this.gratuity.taxableAmount*this.gratuity.taxSlab/100);
            this.gratuity.taxToBePaidDisplayString = this.displayCurrency(this.gratuity.taxToBePaid);
        }
        this.gratuity.taxableAmountDisplayString = this.displayCurrency(this.gratuity.taxableAmount);
        this.gratuity.maxLimitExemptionDisplayString = this.displayCurrency(maxLimit);
    }

    taxSlabEvent(event) {   
        let taxSlab = event.target.value;
        if (this.gratuity.taxableAmount) {
            this.gratuity.taxToBePaid = Math.round(this.gratuity.taxableAmount*taxSlab/100);
            this.gratuity.taxToBePaidDisplayString = this.displayCurrency(this.gratuity.taxToBePaid);
        }
    }

    calculatePayableGratuity() {
        this.gratuity.totalGratuity = Math.round(this.gratuity.gratuityFutureValue-this.gratuity.taxToBePaid);
        this.gratuity.totalGratuityDisplayString = this.displayCurrency(this.gratuity.totalGratuity);
    }

    spouseMaxLimitForExemptionEvent(event) {
        let maxLimit = Number(event.target.value);
        this.gratuity.spouseTaxableAmount = Math.round(this.gratuity.spouseGratuityFutureValue - maxLimit);
        if (this.gratuity.spouseTaxSlab){
            this.gratuity.spouseTaxToBePaid = Math.round(this.gratuity.spouseTaxableAmount*this.gratuity.spouseTaxSlab/100);
            this.gratuity.spouseTaxToBePaidDisplayString = this.displayCurrency(this.gratuity.spouseTaxToBePaid);
        }
        this.gratuity.spouseTaxableAmountDisplayString = this.displayCurrency(this.gratuity.spouseTaxableAmount);
        this.gratuity.spouseMaxLimitExemptionDisplayString = this.displayCurrency(maxLimit);
    }

    spouseTaxSlabEvent(event) {   
        let taxSlab = event.target.value;
        if (this.gratuity.spouseTaxableAmount) {
            this.gratuity.spouseTaxToBePaid = Math.round(this.gratuity.spouseTaxableAmount*taxSlab/100);
            this.gratuity.spouseTaxToBePaidDisplayString = this.displayCurrency(this.gratuity.spouseTaxToBePaid);
        }
    }

    calculateSpousePayableGratuity() {
        this.gratuity.spouseTotalGratuity = Math.round(this.gratuity.spouseGratuityFutureValue-this.gratuity.spouseTaxToBePaid);
        this.gratuity.spouseTotalGratuityDisplayString = this.displayCurrency(this.gratuity.spouseTotalGratuity);
    }

    setGratuityValue(event) {
        let selectedOwnerName = event.target.value;
        if (this.userDetails) {
            this.gratuity.ownerName = selectedOwnerName;
        }

    }

    async calculateGratuity() {
        this.getOwnerId();
        try {
            this.model = await this.gratuityCalculatorRepository.calculateGratuity(this.gratuity, this.clientId, this.ownerId);
            this.gratuity.gratuityPresentValue = this.model.gratuityPresentValue;
            this.gratuity.gratuityFutureValue = this.model.gratuityFutureValue;
            this.gratuity.gratuityPresentValueDisplayString = this.displayCurrency(this.model.gratuityPresentValue);
            this.gratuity.gratuityFutureValueDisplayString = this.displayCurrency(this.model.gratuityFutureValue);
        } catch (error) {
            throw error;
        }
    }


    async calculateSpouseGratuity() {
        this.getOwnerId();
        try {
            this.model = await this.gratuityCalculatorRepository.calculateSpouseGratuity(this.gratuity, this.clientId, this.ownerId);
            this.gratuity.spouseGratuityPresentValue = Math.round(this.model.gratuityPresentValue);
            this.gratuity.spouseGratuityFutureValue = Math.round(this.model.gratuityFutureValue);
            this.gratuity.spouseGratuityPresentValueDisplayString = this.displayCurrency(this.model.gratuityPresentValue);
            this.gratuity.spouseGratuityFutureValueDisplayString = this.displayCurrency(this.model.gratuityFutureValue);
        } catch (error) {
            throw error;
        }
    }

    changeEndOfServiceAge(event){
        let newRetirementAge = event.target.value;
        let change = newRetirementAge-this.userDetails.retirementAge;
        this.gratuity.yearsToRetire = this.userDetails.yearsToRetire+change;
        this.gratuity.serviceYears =  this.userDetails.serviceYears+change;
        this.userDetails.retirementDate = new Date(this.userDetails.retirementDate);
        this.gratuity.retirementDate = new Date(this.gratuity.retirementDate);
        this.gratuity.retirementDate.setFullYear(this.userDetails.retirementDate.getFullYear()+change);
        this.gratuity.salaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.growthRate,this.gratuity.yearsToRetire,1,-1*this.userDetails.salaryComponent,1));

        this.userDetails.retirementAge = newRetirementAge;
        this.userDetails.yearsToRetire = this.gratuity.yearsToRetire;
        this.userDetails.serviceYears = this.gratuity.serviceYears;
        this.userDetails.retirementDate = this.gratuity.retirementDate;
        this.userDetails.incomeFinal = this.gratuity.salaryComponantDuringRetirement;
    }

    changeEndOfServiceDate(event){
        let newRetirementDate = event.year;
        this.userDetails.retirementDate = new Date(this.userDetails.retirementDate);
        let change = newRetirementDate - this.userDetails.retirementDate.getFullYear();
        this.gratuity.yearsToRetire = this.userDetails.yearsToRetire+change;
        this.gratuity.serviceYears =  this.userDetails.serviceYears+change;
        this.gratuity.retirementAge = this.userDetails.retirementAge+change;
        this.gratuity.salaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.growthRate,this.gratuity.yearsToRetire,1,-1*this.userDetails.salaryComponent,1));

        this.userDetails.retirementDate = newRetirementDate;
        this.userDetails.yearsToRetire = this.gratuity.yearsToRetire;
        this.userDetails.serviceYears = this.gratuity.serviceYears;
        this.userDetails.retirementAge = this.gratuity.retirementAge;
        this.userDetails.incomeFinal = this.gratuity.salaryComponantDuringRetirement;
    }

    dateOfJoiningSelected(event){
        event = new Date(event);
        if (!this.userDetails.yearsSinceJoining && !this.userDetails.serviceYears){
            let dob = new Date(this.gratuity.dob);
            let retirementDate = new Date(this.gratuity.retirementDate);
            let today = new Date();
            let joiningDate = moment([event.getFullYear(),event.getMonth(),event.getDate()]);
            let todayMoment = moment([today.getFullYear(),today.getMonth(),today.getDate()]);
            let dobMoment = moment([dob.getFullYear(),dob.getMonth(),dob.getDate()]);
            
            this.gratuity.currentExperience = this.yearDiff(joiningDate,todayMoment);
            this.gratuity.serviceYears = this.yearDiff(joiningDate,retirementDate);
            
            this.userDetails.joiningDate = event;
            this.userDetails.yearsSinceJoining = this.gratuity.currentExperience;
            this.userDetails.serviceYears = this.gratuity.serviceYears;
        }
        else{
            let newJoiningDate = event;
            this.userDetails.joiningDate = new Date(this.userDetails.joiningDate);
            let change = this.userDetails.joiningDate.getFullYear() - newJoiningDate.getFullYear();
            this.gratuity.currentExperience = this.userDetails.yearsSinceJoining + change;
            this.gratuity.serviceYears = this.userDetails.serviceYears + change;

            this.userDetails.joiningDate = event;
            this.userDetails.yearsSinceJoining = this.gratuity.currentExperience;
            this.userDetails.serviceYears = this.gratuity.serviceYears;
        }
    }

    changeSalary(event){
        let newSalary = Number(event.target.value);
        this.gratuity.salaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.growthRate,this.userDetails.yearsToRetire,1,-1*newSalary,1));

        this.userDetails.salaryComponent = event.target.value;
        this.userDetails.incomeFinal = this.gratuity.salaryComponantDuringRetirement;
    }

    changeGrowthRate(event){
        let newGrowthRate = Number(event.target.value);
        this.gratuity.salaryComponantDuringRetirement = Math.round(this.FV(newGrowthRate,this.userDetails.yearsToRetire,1,-1*this.userDetails.salaryComponent,1));

        this.userDetails.growthRate = newGrowthRate;
        this.userDetails.incomeFinal = this.gratuity.salaryComponantDuringRetirement;
    }

    changeCompanyType(event){
        this.gratuity.companyType = event.target.value;
    }

    changeValuationDate(event){
        this.gratuity.valuationDate = new Date(event);
    }

    changeSpouseValuationDate(event){
        this.gratuity.spouseValuationDate = new Date(event);
    }
    
    changeSpouseCompanyType(event){
        this.gratuity.spouseCompanyType = event.target.value;
    }

    changeSpouseEndOfServiceAge(event){
        let newRetirementAge = event.target.value;
        let change = newRetirementAge-this.userDetails.spouseRetirementAge;
        this.gratuity.spouseYearsToRetire = this.userDetails.spouseYearsToRetire+change;
        this.gratuity.spouseServiceYears =  this.userDetails.spouseServiceYears+change;
        this.userDetails.spouseRetirementDate = new Date(this.userDetails.spouseRetirementDate);
        this.gratuity.spouseRetirementDate = new Date(this.gratuity.spouseRetirementDate);
        this.gratuity.spouseRetirementDate.setFullYear(this.userDetails.spouseRetirementDate.getFullYear()+change);
        this.gratuity.spouseSalaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.spouseGrowthRate,this.gratuity.spouseYearsToRetire,1,-1*this.userDetails.spouseSalaryComponant,1));

        this.userDetails.spouseRetirementAge = newRetirementAge;
        this.userDetails.spouseYearsToRetire = this.gratuity.spouseYearsToRetire;
        this.userDetails.spouseServiceYears = this.gratuity.spouseServiceYears;
        this.userDetails.spouseRetirementDate = this.gratuity.spouseRetirementDate;
        this.userDetails.spouseIncomeFinal = this.gratuity.spouseSalaryComponantDuringRetirement;
    }

    changeSpouseEndOfServiceDate(event){
        let newRetirementDate = event.year;
        this.userDetails.spouseRetirementDate = new Date(this.userDetails.spouseRetirementDate);
        let change = newRetirementDate - this.userDetails.spouseRetirementDate.getFullYear();
        this.gratuity.spouseYearsToRetire = this.userDetails.spouseYearsToRetire+change;
        this.gratuity.spouseServiceYears =  this.userDetails.spouseServiceYears+change;
        this.gratuity.spouseRetirementAge = this.userDetails.spouse.retirementAge+change;
        this.gratuity.spouseSalaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.spouseGrowthRate,this.gratuity.spouseYearsToRetire,1,-1*this.userDetails.spouseSalaryComponant,1));

        this.userDetails.spouseRetirementDate = newRetirementDate;
        this.userDetails.spouseRetirementDate = this.gratuity.spouseRetirementDate;
        this.userDetails.spouseYearsToRetire = this.gratuity.spouseYearsToRetire;
        this.userDetails.spouseServiceYears = this.gratuity.spouseServiceYears;
        this.userDetails.spouseIncomeFinal = this.gratuity.spouseSalaryComponantDuringRetirement;
    }

    changeSpouseSalary(event){
        let newSalary = Number(event.target.value);
        this.gratuity.spouseSalaryComponantDuringRetirement = Math.round(this.FV(this.userDetails.spouseGrowthRate,this.userDetails.spouseYearsToRetire,1,-1*newSalary,1));

        this.userDetails.spouseSalaryComponant = newSalary;
        this.userDetails.spouseIncomeFinal = this.gratuity.spouseSalaryComponantDuringRetirement;
    }

    changeSpouseGrowthRate(event){
        let newGrowthRate = Number(event.target.value);
        console.log(this.userDetails.spouseSalaryComponant);
        this.gratuity.spouseSalaryComponantDuringRetirement = Math.round(this.FV(newGrowthRate,this.userDetails.spouseYearsToRetire,1,-1*this.userDetails.spouseSalaryComponant,1));

        this.userDetails.spouseGrowthRate = newGrowthRate;
        this.userDetails.spouseIncomeFinal = this.gratuity.spouseSalaryComponantDuringRetirement
    }

    spouseDateOfJoiningSelected(event){
        event = new Date(event);
        if (!this.userDetails.spouseYearsSinceJoining && !this.userDetails.spouseServiceYears){
            let dob = new Date(this.gratuity.spousedob);
            let retirementDate = new Date(this.gratuity.spouseRetirementDate);
            let today = new Date();
            let joiningDate = moment([event.getFullYear(),event.getMonth(),event.getDate()]);
            let todayMoment = moment([today.getFullYear(),today.getMonth(),today.getDate()]);
            let dobMoment = moment([dob.getFullYear(),dob.getMonth(),dob.getDate()]);
            
            // this.gratuity.spouseCurrentExperience = Math.abs(joiningDate.diff(todayMoment,'years'));
            this.gratuity.spouseCurrentExperience = this.yearDiff(joiningDate,todayMoment);
            // this.gratuity.spouseServiceYears = this.gratuity.spouseRetirementAge-Math.abs(joiningDate.diff(dobMoment,'years'));
            // this.gratuity.spouseServiceYears = this.gratuity.spouseRetirementAge-this.yearDiff(joiningDate,dobMoment);
            this.gratuity.spouseServiceYears = this.yearDiff(joiningDate,retirementDate);
            
            this.userDetails.spouseJoiningDate = event;
            this.userDetails.spouseYearsSinceJoining = this.gratuity.spouseCurrentExperience;
            this.userDetails.spouseServiceYears = this.gratuity.spouseServiceYears;
        }
        else{
            let newJoiningDate = event;
            this.userDetails.spouseJoiningDate = new Date(this.userDetails.spouseJoiningDate);
            let change = this.userDetails.spouseJoiningDate.getFullYear() - newJoiningDate.getFullYear();
            this.gratuity.spouseCurrentExperience = this.userDetails.spouseYearsSinceJoining + change;
            this.gratuity.spouseServiceYears = this.userDetails.spouseServiceYears + change;
            
            this.userDetails.spouseJoiningDate = event;
            this.userDetails.spouseYearsSinceJoining = this.gratuity.spouseCurrentExperience;
            this.userDetails.spouseServiceYears = this.gratuity.spouseServiceYears;
        }
    }

    setGratuityValuesAsUndefined() {
        this.gratuity.valuationDate = undefined;
        this.gratuity.ownerName = undefined;
        this.gratuity.dob = undefined;
        this.gratuity.age = undefined;
        this.gratuity.retirementAge = undefined;
        this.gratuity.initialOwnerName = undefined;
        this.gratuity.retirementDate = undefined
        this.gratuity.yearsToRetire = undefined
        this.gratuity.dateOfJoinng = undefined;
        this.gratuity.companyType = undefined;
        this.gratuity.salaryComponant = undefined;
        this.gratuity.salaryComponantDuringRetirement = undefined;
        this.gratuity.growthRate = undefined;
        this.gratuity.currentExperience = undefined;
        this.gratuity.serviceYears = undefined;
        this.gratuity.gratuityPresentValue = undefined;
        this.gratuity.gratuityFutureValue = undefined;
        
        this.gratuity.spouseValuationDate = undefined;
        this.gratuity.spouseOwnerName = undefined;
        this.gratuity.spousedob = undefined;
        this.gratuity.spouseAge = undefined;
        this.gratuity.spouseRetirementAge = undefined;
        this.gratuity.spouseRetirementDate = undefined;
        this.gratuity.spouseYearsToRetire = undefined;
        this.gratuity.spouseDateOfJoinng = undefined;
        this.gratuity.spouseCompanyType = undefined;
        this.gratuity.spouseSalaryComponant = undefined;
        this.gratuity.spouseSalaryComponantDuringRetirement = undefined;
        this.gratuity.spouseGrowthRate = undefined;
        this.gratuity.spouseCurrentExperience = undefined;
        this.gratuity.spouseServiceYears = undefined;
        this.gratuity.spouseGratuityPresentValue = undefined;
        this.gratuity.spouseGratuityFutureValue = undefined;
        this.gratuity.spouseInitialOwnerName = undefined;
    }


    //Move this method to core
    parseDate(date) {
        return new Date(date)
    }


    displayCurrency(amount) {

        return this.formatter.currencyFormatter(Math.round(amount));

    }

    PV(rate, periods, payment, future, type) {
        rate=rate/100;
        var type = (typeof type === 'undefined') ? 0 : type;
        rate = eval(rate);
        periods = eval(periods);
        if (rate === 0) {
            return Math.round(- payment * periods - future);
        } else {
            return Math.round((((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 + rate * type) - future) / Math.pow(1 + rate, periods));
        }
    }

    FV(rate, nper, pmt, pv, type) {
        rate=rate/100;
        // console.log('--------------------------------');
        // console.log('Rate-> ',rate,typeof(rate));
        // console.log('NPER-> ',nper,typeof(nper));
        // console.log('PMT-> ',pmt,typeof(pmt));
        // console.log('PV-> ',pv,typeof(pv));
        // console.log('Type-> ',type,typeof(type));
        // console.log('--------------------------------');
        
        var pow = Math.pow(1 + rate, nper);
        // console.log('Pow-> ',pow);
        let fv = 0;
        if (rate) {
            fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
        } else {
            fv = -1 * (pv + pmt * nper);
        }
        // return Math.round(parseInt(fv).toFixed(2));
        // console.log('FV-> ',fv);
        return fv;
    }

    FV2(r, nper, pmt, pv, pd) {
        return -(pv * this.fvFactor(r, nper) + pmt * this.annuityCertainFvFactor(r, nper, pd));
    };

    annuityCertainFvFactor(r, nper, pd) {
        return this.annuityCertainPvFactor(r, nper, pd ) * this.fvFactor(r, nper);
    };

    annuityCertainPvFactor (r, nper, pd) {
        if (r === 0) {
            return nper;
        }
        else {
            return (1 + r * pd) * (1 - this.pvFactor(r, nper)) / r;
        }
    };

    fvFactor(r, nper) {
        return Math.pow(1 + r, nper);
    };


    pvFactor(r, nper) {
        return (1 / this.fvFactor(r, nper));
    };

    yearDiff(moment1,moment2){
        let duration = moment.duration(moment1.diff(moment2));
        return Math.round(Math.abs(duration.asYears()));
    }

}

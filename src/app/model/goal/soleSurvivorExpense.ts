import { Attachment } from '../asset/attachment/attachment';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { ExpenseTypeUtils, ExpenseType } from '../enum/expense/expense-type.enum';
import { FixedExpenseTypeUtils } from '../enum/expense/fixed-expense-type';
import { DiscretionaryExpenseTypeUtils } from '../enum/expense/discretionary-type.enum';
import { ExpenseCategoryTypeUtils, ExpenseCategoryType } from '../enum/expense/expense-category-type.enum';

import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../enum/asset/committed-saving-frequency.enum'


import { FoodExpense } from './../expense/food';
import { FamilyCareExpense } from './../expense/familyCare';
import { HealthCareExpense } from './../expense/healthCare';
import { HousingExpense } from './../expense/housing';
import { MiscellaneousExpense } from './../expense/miscellaneous';
import { OtherExpense } from './../expense/other';
import { PersonalExpense } from './../expense/personal';
import { PetExpense } from './../expense/pet';
import { RecreationExpense } from './../expense/recreation';
import { TransportationExpense } from './../expense/transportation';
import { UtilityExpense } from './../expense/utility';


@JsonObject
export class SoleSurvivorExpense {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("kind", String) kind: string = undefined
    @JsonProperty("category", Number) category: number = undefined
    @JsonProperty("earlyRetirementExpenseAmount", Number) earlyRetirementExpenseAmount: number = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined
    @JsonProperty("subtype", Number) subtype: Number = undefined
    @JsonProperty("name", String) name: string = undefined
    @JsonProperty("lateRetirementExpensePercentage", Number) lateRetirementExpensePercentage: number = undefined
    @JsonProperty("lateRetirementExpenseAmount", Number) lateRetirementExpenseAmount: number = undefined
    @JsonProperty("lateRetirementExpenseInflationRate", Number) lateRetirementExpenseInflationRate: number = undefined
    @JsonProperty("inflationRate", Number) inflationRate: number = undefined
    @JsonProperty("currentInflationRate", Number) currentInflationRate: number = undefined
    @JsonProperty("isClientInsuranceNeedAnalysis", Boolean) isClientInsuranceNeedAnalysis: boolean = undefined
    @JsonProperty("isSpouseInsuranceNeedAnalysis", Boolean) isSpouseInsuranceNeedAnalysis: boolean = undefined

    isNameEmpty = false
    isSelected = false;

    static discriminatorInfo = {
        key: "kind",
        subclasses: {
            "FamilyCareExpense": "FamilyCareExpense",
            "FoodExpense": "FoodExpense",
            "HealthCareExpense": "HealthCareExpense",
            "HousingExpense": "HousingExpense",
            "MiscellaneousExpense": "MiscellaneousExpense",
            "PersonalExpense": "PersonalExpense",
            "PetExpense": "PetExpense",
            "RecreationExpense": "RecreationExpense",
            "TransportationExpense": "TransportationExpense",
            "UtilityExpense": "UtilityExpense",
            "OtherExpense": "OtherExpense"
        }
    }

    constructor() {

    }

    displayExpenseTypeName() {
        if (this.category == ExpenseCategoryType.Fixed) {
            return FixedExpenseTypeUtils.getFixedExpenseTypeText(this.kind);
        } else {
            return DiscretionaryExpenseTypeUtils.getDiscretionaryExpenseTypeText(this.kind);
        }
    }

    frequencyDisplayString() {
        if (this.frequency != null) {
            return CommittedSavingFrequencyTypeUtils.getCommittedSavingFrequencyTypeText(this.frequency)
        }
    }

    subtypeDisplayName() {
    }

    calculatePerAnnumAmount(amount) {
        let annualAmount
        if (this.frequency != null) {
            if (this.frequency == CommittedSavingFrequencyType.Yearly) {
                annualAmount = amount
            } else if (this.frequency == CommittedSavingFrequencyType.Monthly) {
                annualAmount = amount * 12
            } else if (this.frequency == CommittedSavingFrequencyType.Quarterly) {
                annualAmount = amount * 4
            } else if (this.frequency == CommittedSavingFrequencyType.HalfYearly) {
                annualAmount = amount * 2
            }
        }
        return annualAmount
    }

    amountPerAnnum() {
        return this.calculatePerAnnumAmount(this.earlyRetirementExpenseAmount)
    }

}


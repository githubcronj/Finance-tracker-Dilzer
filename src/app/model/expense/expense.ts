import { Attachment } from '../asset/attachment/attachment';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { ExpenseTypeUtils, ExpenseType } from '../enum/expense/expense-type.enum';
import { FixedExpenseTypeUtils } from '../enum/expense/fixed-expense-type';
import { DiscretionaryExpenseTypeUtils } from '../enum/expense/discretionary-type.enum';
import { ExpenseCategoryTypeUtils, ExpenseCategoryType } from '../enum/expense/expense-category-type.enum';

import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../enum/asset/committed-saving-frequency.enum'


import { FoodExpense } from './food';
import { FamilyCareExpense } from './familyCare';
import { HealthCareExpense } from './healthCare';
import { HousingExpense } from './housing';
import { MiscellaneousExpense } from './miscellaneous';
import { OtherExpense } from './other';
import { PersonalExpense } from './personal';
import { PetExpense } from './pet';
import { RecreationExpense } from './recreation';
import { TransportationExpense } from './transportation';
import { UtilityExpense } from './utility';
import { FormatterService } from 'app/services/formatter.service';

@JsonObject
export class Expense {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("kind", String) kind: string = undefined
    @JsonProperty("category", Number) category: number = undefined
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined
    @JsonProperty("subtype", Number) subtype: Number = undefined
    @JsonProperty("name", String) name: string = undefined
    @JsonProperty("earlyRetirementExpensePercentage", Number) earlyRetirementExpensePercentage: number = undefined
    @JsonProperty("earlyRetirementExpenseAmount", Number) earlyRetirementExpenseAmount: number = undefined
    @JsonProperty("earlyRetirementExpenseInflationRate", Number) earlyRetirementExpenseInflationRate: number = undefined
    @JsonProperty("lateRetirementExpensePercentage", Number) lateRetirementExpensePercentage: number = undefined
    @JsonProperty("lateRetirementExpenseAmount", Number) lateRetirementExpenseAmount: number = undefined
    @JsonProperty("lateRetirementExpenseInflationRate", Number) lateRetirementExpenseInflationRate: number = undefined
    @JsonProperty("currentInflationRate", Number) currentInflationRate: number = undefined
    @JsonProperty("isClientInsuranceNeedAnalysis", Boolean) isClientInsuranceNeedAnalysis: boolean = undefined
    @JsonProperty("isSpouseInsuranceNeedAnalysis", Boolean) isSpouseInsuranceNeedAnalysis: boolean = undefined


    isNameEmpty = false
    isSelected = false;
    formatter = new FormatterService()

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

    static categorizeExpenses(expenses) {
        const expensesCategory = [];
        const expensesType = [];
        const completeExpenseDetails: any = {}

        for (const expense of expenses) {
            const totalCurrentLivingExpense = this.calculateTotalAmountForExpensesTypes(expense.frequency, expense.amount);
            const totalEarlyRetirementExpense = this.calculateTotalAmountForExpensesTypes(expense.frequency, expense.earlyRetirementExpenseAmount);
            const totalLateRetirementExpense = this.calculateTotalAmountForExpensesTypes(expense.frequency, expense.lateRetirementExpenseAmount);
            if (expensesCategory.length > 0) {
                for (const expenseObj of expensesCategory) {
                    if (expenseObj.expenseType == expense.kind) {
                        expenseObj.totalCurrentLivingExpenses = expenseObj.totalCurrentLivingExpenses + totalCurrentLivingExpense;
                        expenseObj.totalEarlyRetirementExpenses = expenseObj.totalEarlyRetirementExpenses + totalEarlyRetirementExpense;
                        expenseObj.totalLateRetirementExpenses = expenseObj.totalLateRetirementExpenses + totalLateRetirementExpense;
                    } else {
                        if (expensesType.indexOf(expense.kind) == -1) {
                            expensesType.push(expense.kind);
                            expensesCategory.push({
                                'displayString': this.displayExpenseTypeName(expense.category, expense.kind),
                                'isSelected': false,
                                'expenseType': expense.kind,
                                'totalCurrentLivingExpenses': 0,
                                'totalEarlyRetirementExpenses': 0,
                                'totalLateRetirementExpenses': 0
                            })
                        }
                    }
                }
            } else {
                expensesType.push(expense.kind);
                expensesCategory.push({
                    'displayString': this.displayExpenseTypeName(expense.category, expense.kind),
                    'isSelected': false,
                    'expenseType': expense.kind,
                    'totalCurrentLivingExpenses': totalCurrentLivingExpense,
                    'totalEarlyRetirementExpenses': totalEarlyRetirementExpense,
                    'totalLateRetirementExpenses': totalLateRetirementExpense
                })
            }

        }

        for (let exp of expensesCategory) {
            completeExpenseDetails.currentLivingSummation = (completeExpenseDetails.currentLivingSummation) ? completeExpenseDetails.currentLivingSummation + exp.totalCurrentLivingExpenses : exp.totalCurrentLivingExpenses
            completeExpenseDetails.earlyRetirementSummation = (completeExpenseDetails.earlyRetirementSummation) ? completeExpenseDetails.earlyRetirementSummation + exp.totalEarlyRetirementExpenses : exp.totalEarlyRetirementExpenses
            completeExpenseDetails.lateRetirementSummation = (completeExpenseDetails.lateRetirementSummation) ? completeExpenseDetails.lateRetirementSummation + exp.totalLateRetirementExpenses : exp.totalLateRetirementExpenses
        }
        completeExpenseDetails.categorisedExpense = expensesCategory;
        return completeExpenseDetails
    }

    static calculateTotalAmountForExpensesTypes(frequency, amount) {
        let annualAmount
        if (frequency != null) {
            if (frequency == CommittedSavingFrequencyType.Yearly) {
                annualAmount = amount
            } else if (frequency == CommittedSavingFrequencyType.Monthly) {
                annualAmount = amount * 12
            } else if (frequency == CommittedSavingFrequencyType.Quarterly) {
                annualAmount = amount * 4
            } else if (frequency == CommittedSavingFrequencyType.HalfYearly) {
                annualAmount = amount * 2
            }
        }
        return annualAmount
    }

    constructor() {

    }

    static displayExpenseTypeName(category, kind) {
        if (category == ExpenseCategoryType.Fixed) {
            return FixedExpenseTypeUtils.getFixedExpenseTypeText(kind);
        } else {
            return DiscretionaryExpenseTypeUtils.getDiscretionaryExpenseTypeText(kind);
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
        return this.calculatePerAnnumAmount(this.amount)
    }

    earlyRetirementAmountPerAnnum() {
        return this.calculatePerAnnumAmount(this.earlyRetirementExpenseAmount)
    }

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);

    }

}


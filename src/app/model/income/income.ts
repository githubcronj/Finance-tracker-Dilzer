import { Attachment } from '../asset/attachment/attachment';
import { IncomeTypeUtils } from '../enum/income-type.enum';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../enum/asset/committed-saving-frequency.enum';
import { Beneficiary } from './beneficiary';
import { FormatterService } from 'app/services/formatter.service';


@JsonObject
export class Income {

    @JsonProperty("_id", String) _id: string = undefined
    @JsonProperty("kind", String) kind: string = undefined
    @JsonProperty("name", String) name: string = undefined
    @JsonProperty("associatedAsset", String) associatedAsset: string = undefined
    @JsonProperty("owners", [String]) owners: string[] = []
    @JsonProperty("startDate", Date) startDate: Date = undefined
    @JsonProperty("endDate", Date) endDate: Date = undefined
    @JsonProperty("amount", Number) amount: number = undefined
    @JsonProperty("frequency", Number) frequency: number = undefined
    @JsonProperty("growthRate", Number) growthRate: number = undefined
    @JsonProperty('beneficiary', Beneficiary) beneficiary: Beneficiary = new Beneficiary()
    @JsonProperty("createdAt", Date) createdAt: Date = undefined
    @JsonProperty("updatedAt", Date) updatedAt: Date = undefined
    @JsonProperty("attachments", [Attachment]) attachments: Attachment[] = []


    isSelected = false;
    formatter = new FormatterService()

    static discriminatorInfo = {
        key: "kind",
        subclasses: {
            "BusinessIncome": "BusinessIncome",
            "DividendIncome": "DividendIncome",
            "GovernmentPensionIncome": "GovernmentPensionIncome",
            "InterestIncome": "InterestIncome",
            "MoneyBackPolicyPayoutIncome": "MoneyBackPolicyPayoutIncome",
            "NetSalaryIncome": "NetSalaryIncome",
            "PensionIncome": "PensionIncome",
            "ProfessionalIncome": "ProfessionalIncome",
            "RentalIncome": "RentalIncome",
            "SuperannuationIncome": "SuperannuationIncome",
            "VariableIncome": "VariableIncome",
            "OtherIncome": "OtherIncome"
        }
    }

    constructor() {

    }

    displayIncomeTypeName() {
        return IncomeTypeUtils.getIncomeTypeText(this.kind)
    }

    displayStartDate() {
        if (this.startDate != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.startDate, 'dd/MM/yyyy');
        }
    }

    displayEndDate() {
        if (this.endDate != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.endDate, 'dd/MM/yyyy');
        }
    }

    createdDateDisplayString() {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(this.createdAt, 'dd/MM/yyyy');
    }

    frequencyDisplayString() {
        return CommittedSavingFrequencyTypeUtils.getCommittedSavingFrequencyTypeText(this.frequency)
    }

    amountPerAnnum() {

        let amount = 0
        if (this.frequency != null) {
            if (this.frequency == CommittedSavingFrequencyType.Yearly) {
                amount = this.amount
            } else if (this.frequency == CommittedSavingFrequencyType.Monthly) {
                amount = this.amount * 12
            } else if (this.frequency == CommittedSavingFrequencyType.Quarterly) {
                amount = this.amount * 4
            } else if (this.frequency == CommittedSavingFrequencyType.HalfYearly) {
                amount = this.amount * 2
            }
        }
        return amount
    }

    static calculateTotalIncomeForCurrentFinancialYear(incomes) {

        let totalIncomeAmount = 0

        for (let income of incomes) {
            if (income.frequency != null) {
                if (income.frequency == CommittedSavingFrequencyType.Yearly) {
                    totalIncomeAmount += income.amount
                } else if (income.frequency == CommittedSavingFrequencyType.HalfYearly) {
                    totalIncomeAmount += income.amount * 2
                } else if (income.frequency == CommittedSavingFrequencyType.Quarterly) {
                    totalIncomeAmount += income.amount * 4
                } else if (income.frequency == CommittedSavingFrequencyType.Monthly) {
                    totalIncomeAmount += income.amount * 12
                }
            }
        }

        return totalIncomeAmount

    }


    static currentFinancialYearIncomes(incomes) {

        let currentDate = new Date()
        let startDateOfFinancialYear = new Date()
        let endDateOfFinancialYear = new Date()

        let tempDate = new Date()
        tempDate.setDate(1)
        tempDate.setMonth(3)
        tempDate.setFullYear(currentDate.getFullYear())

        let incomeInfo = {
            currentYearIncomes: [],
            currentYearTotalIncome: 0
        }

        if (currentDate >= tempDate) {
            startDateOfFinancialYear.setMonth(3)
            startDateOfFinancialYear.setDate(1)
            startDateOfFinancialYear.setFullYear(currentDate.getFullYear())
            endDateOfFinancialYear.setMonth(2)
            endDateOfFinancialYear.setDate(31)
            endDateOfFinancialYear.setFullYear(currentDate.getFullYear() + 1)
        } else {
            startDateOfFinancialYear.setMonth(3)
            startDateOfFinancialYear.setDate(1)
            startDateOfFinancialYear.setFullYear(currentDate.getFullYear() - 1)
            endDateOfFinancialYear.setMonth(2)
            endDateOfFinancialYear.setDate(31)
            endDateOfFinancialYear.setFullYear(currentDate.getFullYear())

        }

        for (let income of incomes) {
            if (income.startDate >= startDateOfFinancialYear && income.startDate <= endDateOfFinancialYear) {
                incomeInfo.currentYearIncomes.push(income)

                if (income.frequency != null) {
                    if (income.frequency == CommittedSavingFrequencyType.Yearly) {
                        incomeInfo.currentYearTotalIncome += income.amount
                    } else if (income.frequency == CommittedSavingFrequencyType.HalfYearly) {
                        incomeInfo.currentYearTotalIncome += income.amount * 2
                    } else if (income.frequency == CommittedSavingFrequencyType.Quarterly) {
                        incomeInfo.currentYearTotalIncome += income.amount * 4
                    } else if (income.frequency == CommittedSavingFrequencyType.Monthly) {
                        incomeInfo.currentYearTotalIncome += income.amount * 12
                    }
                }
            }
        }

        return incomeInfo
    }


    displayAmountInPerAnnum(frequency, amount) {

        let incomeAmount = 0
        if (frequency != null) {
            if (frequency == CommittedSavingFrequencyType.Yearly) {
                incomeAmount = amount
            } else if (frequency == CommittedSavingFrequencyType.Monthly) {
                incomeAmount = amount * 12
            } else if (frequency == CommittedSavingFrequencyType.Quarterly) {
                incomeAmount = amount * 4
            } else if (frequency == CommittedSavingFrequencyType.HalfYearly) {
                incomeAmount = amount * 2
            }
        }
        return incomeAmount
    }

    displayCurrencyString(amount) {

        return this.formatter.currencyFormatter(amount);

    }

}

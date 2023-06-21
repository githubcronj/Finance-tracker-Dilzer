import { CommittedRepayment } from '../committedRepayment';
import { LoanStage } from './loanStage/loanStage';
import { LoanRevision } from './loanRevision/loanRevision';
import { DecreaseInEmi } from './decreaseInEmi/decreaseInEmi';
import { Attachment } from '../asset/attachment/attachment';
import { LiabilityTypeUtils } from '../enum/liability-type.enum';
import { CommittedSavingTypeUtils, CommittedSavingType } from '../enum/asset/committed-saving.enum';
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { JsonConvert } from '../../model/parsers/json-convert';
import { DatePipe } from '@angular/common';
import * as DateDiff from 'date-diff';
import { FinanceService } from '../../services/finance.service';
import { CommittedSavingFrequencyType } from '../enum/asset/committed-saving-frequency.enum';
import { FormatterService } from 'app/services/formatter.service';

@JsonObject
export class Liability {

        @JsonProperty("_id", String) _id: string = undefined
        @JsonProperty("kind", String) kind: string = undefined
        @JsonProperty("name", String) name: string = undefined
        @JsonProperty("loanAmount", Number) loanAmount: number = undefined
        @JsonProperty("owners", [String]) owners: string[] = []
        @JsonProperty("preclosurePercentage", Number) preclosurePercentage: number = undefined
        @JsonProperty("rateOfInterest", Number) rateOfInterest: number = undefined
        @JsonProperty("associatedAsset", String) associatedAsset: string = undefined
        @JsonProperty("loanTakenDate", Date) loanTakenDate: Date = undefined
        @JsonProperty("loadEndDate", Date) loadEndDate: Date = undefined
        @JsonProperty("tenure", Number) tenure: number = undefined
        @JsonProperty("totalInterestPaid", Number) totalInterestPaid: number = undefined
        @JsonProperty("totalAmountPaid", Number) totalAmountPaid: number = undefined
        @JsonProperty("committedRepayments", [CommittedRepayment]) committedRepayments: CommittedRepayment[] = []
        @JsonProperty("attachments", [Attachment]) attachments: Attachment[] = []
        @JsonProperty("currentStage", LoanStage) currentStage: LoanStage = new LoanStage();
        @JsonProperty("loanRevision", LoanRevision) loanRevision: LoanRevision = new LoanRevision();
        @JsonProperty("decreaseInEmi", DecreaseInEmi) decreaseInEmi: DecreaseInEmi = new DecreaseInEmi();
        @JsonProperty("createdAt", Date) createdAt: Date = undefined
        @JsonProperty("updatedAt", Date) updatedAt: Date = undefined


        isSelected = false;
        formatter = new FormatterService()

        static discriminatorInfo = {
                key: "kind",
                subclasses: {
                        "CarLoan": "CarLoan",
                        "CreditCardLoan": "CreditCardLoan",
                        "GoldLoan": "GoldLoan",
                        "HousingLoan": "HousingLoan",
                        "MortgageLoan": "MortgageLoan",
                        "PersonalLoan": "PersonalLoan",
                        "OtherLoan": "OtherLoan",
                }
        }


        constructor() {
                this.committedRepayments = []
                this.attachments = []
        }

        displayNumberOfRepaymentsPaid() {
                return Math.round(this.currentStage.numberOfRepaymentsPaid)
        }


        get tenureDisplayString(): String {

                if (this.tenure > 0) {

                        let tenureYears = Math.floor(this.tenure / 12)
                        let tenureMonths = Math.floor(this.tenure % 12)
                        if (tenureMonths > 0) {
                                return String(tenureYears) + "." + String(tenureMonths)
                        }
                        return String(tenureYears)
                } else {
                        return ""

                }

        }


        displayNumberOfRepaymentsPayable() {
                return Math.round(this.currentStage.numberOfRepaymentsPayable)
        }

        displayLiabilityTypeName() {
                return LiabilityTypeUtils.getLiabilityTypeText(this.kind)
        }

        displayLoanTakenDate() {
                if (this.loanTakenDate != null) {
                        const datePipe = new DatePipe('en-US');
                        return datePipe.transform(this.loanTakenDate, 'dd/MM/yyyy');
                }
        }

        displayLoanEndDate() {
                if (this.loadEndDate != null) {
                        const datePipe = new DatePipe('en-US');
                        return datePipe.transform(this.loadEndDate, 'dd/MM/yyyy');
                }
        }

        createdDateDisplayString() {
                const datePipe = new DatePipe('en-US');
                return datePipe.transform(this.createdAt, 'dd/MM/yyyy');
        }


        calculateTenure(finance: FinanceService) {

                if (this.loanTakenDate != null && this.loadEndDate != null) {
                        var diff = new DateDiff(this.loadEndDate, this.loanTakenDate);
                        this.tenure = Math.floor(diff.months())
                }

                this.calculateOriginalInterestPaid(finance)
                this.calculateStageAndRepayment(finance)



        }

        calculateOriginalInterestPaid(finance: FinanceService) {

                this.totalInterestPaid = finance.CUMIPMT(this.rateOfInterest, this.tenure, this.loanAmount, 1, this.tenure)

                if (this.totalInterestPaid && this.loanAmount) {
                        let totalAmountPaid = this.loanAmount - this.totalInterestPaid
                        this.totalAmountPaid = totalAmountPaid
                }

        }

        calculateStageAndRepayment(financeService: FinanceService) {


                if (this.currentStage) {
                        if (this.currentStage.outStandingAmount) {
                                this.currentStage.numberOfRepaymentsPaid = Math.floor(new DateDiff(this.currentStage.date, this.loanTakenDate).months())
                                this.currentStage.numberOfRepaymentsPayable = financeService.NPER(this.rateOfInterest, this.currentStage.emiPaid, this.currentStage.outStandingAmount)
                                this.currentStage.remainingInterestPayable = Math.round(financeService.CUMIPMT(this.rateOfInterest, this.currentStage.numberOfRepaymentsPayable, this.currentStage.outStandingAmount, 1, this.currentStage.numberOfRepaymentsPayable))
                                let remainingInterestPayable = Math.abs(this.currentStage.remainingInterestPayable)
                                this.currentStage.remainingPrincipalPayable = this.currentStage.outStandingAmount + remainingInterestPayable

                        }
                }

                this.calculateIncreaseInEmi(financeService)
                this.calculateDecreaseInEmi(financeService)
        }


        calculateIncreaseInEmi(financeService: FinanceService) {

                let outstandingAmount = this.currentStage.outStandingAmount;
                for (let committedRepayment of this.committedRepayments) {
                        if (committedRepayment.kind == "Lumpsum") {
                                outstandingAmount = outstandingAmount - committedRepayment.amount
                        }

                }

                let revisedTenure = financeService.NPER(this.loanRevision.revisedRate, this.loanRevision.emiPaidAfterRevision, outstandingAmount)
                this.loanRevision.numberOfRepaymentsPayableAfterRevision = revisedTenure

                let interestPayableWithRevisedTenure = financeService.CUMIPMT(this.loanRevision.revisedRate, revisedTenure, outstandingAmount, 1, revisedTenure)
                this.loanRevision.remainingInterestPayableAfterRevision = interestPayableWithRevisedTenure

                let interestPayableWithOriginalTenure = financeService.CUMIPMT(this.loanRevision.revisedRate, this.tenure, outstandingAmount, 1, this.currentStage.numberOfRepaymentsPayable)
                this.loanRevision.savingsAfterRevision = interestPayableWithOriginalTenure - interestPayableWithRevisedTenure

        }

        calculateDecreaseInEmi(financeService: FinanceService) {

                let revisedTenure = financeService.NPER(this.decreaseInEmi.revisedRate, this.decreaseInEmi.emiPaidAfterRevision, this.currentStage.outStandingAmount)
                this.decreaseInEmi.numberOfRepaymentsPayableAfterRevision = revisedTenure

                let interestPayableWithRevisedTenure = financeService.CUMIPMT(this.decreaseInEmi.revisedRate, revisedTenure, this.currentStage.outStandingAmount, 1, revisedTenure)
                this.decreaseInEmi.remainingInterestPayableAfterRevision = interestPayableWithRevisedTenure

                //let interestPayableWithRevisedTenure = financeService.CUMIPMT(8.55, 294, 18918639, 1, 294)

                let interestPayableWithOriginalTenure = financeService.CUMIPMT(this.rateOfInterest, this.currentStage.numberOfRepaymentsPayable, this.currentStage.outStandingAmount, 1, this.currentStage.numberOfRepaymentsPayable)
                this.decreaseInEmi.additionalInterestPayableAfterRevision = interestPayableWithOriginalTenure - interestPayableWithRevisedTenure

        }


        static calculateLiabilityDataForCashflow(liabilities) {

                let liabilityInfo = {
                        totalLoanOutstandingAmount: 0,
                        committedRepayments: [],
                        totalCommittedRepaymentAmount: 0
                }

                for (let liability of liabilities) {
                        liabilityInfo.totalLoanOutstandingAmount += liability.currentStage.outStandingAmount

                        for (let repayment of liability.committedRepayments) {
                                liabilityInfo.committedRepayments.push(repayment)

                                if (repayment.kind == String(CommittedSavingType.LupsumDeposit)) {
                                        liabilityInfo.totalCommittedRepaymentAmount += repayment.amount
                                } else {
                                        if (repayment.frequency == CommittedSavingFrequencyType.HalfYearly) {
                                                liabilityInfo.totalCommittedRepaymentAmount += (repayment.amount * 2)
                                        } else if (repayment.frequency == CommittedSavingFrequencyType.Quarterly) {
                                                liabilityInfo.totalCommittedRepaymentAmount += (repayment.amount * 4)
                                        } else if (repayment.frequency == CommittedSavingFrequencyType.Monthly) {
                                                liabilityInfo.totalCommittedRepaymentAmount += (repayment.amount * 12)
                                        } else {
                                                liabilityInfo.totalCommittedRepaymentAmount += repayment.amount
                                        }
                                }
                        }
                }

                return liabilityInfo

        }

        displayCurrencyString(amount) {

                return this.formatter.currencyFormatter(amount);

        }

}

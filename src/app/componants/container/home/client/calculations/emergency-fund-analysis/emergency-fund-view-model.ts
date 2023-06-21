import { Injectable } from '@angular/core';
import { JsonConvert } from '../../../../../../model/parsers/json-convert';
import { HttpService } from '../../../../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { Liability } from '../../../../../../model/liability/liability';
import { EmergencyFundRepository } from '../../../../../../repository/emergency-fund/emergency-fund.repository';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { MaterialDialogPaddingRemover } from '../../../../../../core/material-dialog-padding-remover';
import { Expense } from '../../../../../../model/expense/expense';
import { LiabilityTypeUtils } from '../../../../../../model/enum/liability-type.enum';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository';
import { UserRepository } from '../../../../../../repository/user/user.repository';


@Injectable()
export class EmergencyFundViewModel {

    public emergencyFund = {
        'householdExpense': undefined,
        'householdExpenseBreakUp': [],
        'insurancePremium': undefined,
        'insurancePremiumBreakUp': [],
        'loanEMIServicing': undefined,
        'loanEMIServicingBreakUp': [],
        'totalMonthlyExpense': undefined,
        'emergencyPeriod': undefined,
        'emergencyFundRequired': undefined,
    };
    public householdExpense = 1;
    public insurancePremiums = 1;
    public loanEMI = 1;
    public monthsToBudget = 0;
    public emergencyFundRequired = 0;
    public totalMonthyExpense = 0;
    public expenseBreakup = [];
    public assetBreakup = [];
    public liabilitiesBreakup = [];
    public clientId;
    public isAllExpensesSelected = false;
    public financialAssets;
    public insuranceAssets = [];
    private model;


    constructor(private emergencyFundRepository: EmergencyFundRepository,
        private httpService: HttpService,
        private cashflowRepository: CashflowRepository,
        private networthRepository: NetworthRepository,
        private userRepository : UserRepository,
        ) { }


    async getEmergencyFundDetailsFromRepository() {
        try {
            let loanAmount = 0;
            let totalMonthlyExpense = 0;
            let insurancePremium = 0;

            this.expenseBreakup = [];
            this.insuranceAssets = [];
            this.liabilitiesBreakup = [];
            console.log('Client Id-> ',this.clientId);
            const parser = new JsonConvert();
            const liabilityResponse = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/liability`, null);
            let committedRepayments = parser.deserializeArray(liabilityResponse.liabilities, Liability)
            for (let committedRepayment of committedRepayments){
                let liabilityObject = {
                    "name": committedRepayment.name,
                    "kind": committedRepayment.kind,
                    "loanAmount": committedRepayment.loanAmount,
                    "rateOfInterest": committedRepayment.rateOfInterest
                }
                this.emergencyFund.loanEMIServicingBreakUp.push(liabilityObject);
                loanAmount += committedRepayment.loanAmount;
            }
            this.emergencyFund.loanEMIServicing = Math.round(loanAmount/12);

            let expenses = await this.cashflowRepository.getExpenses(this.clientId);
            for (let expense of expenses){
                let expenseObject = {
                    'name': expense.kind,
                    'amount': expense.currentLivingExpenses,
                }
                this.emergencyFund.householdExpenseBreakUp.push(expenseObject);
                totalMonthlyExpense += expense.currentLivingExpenses;
            };
            this.emergencyFund.householdExpense = Math.round(totalMonthlyExpense/12);
            
            this.insuranceAssets = await this.networthRepository.getAssets(this.clientId,"Insurance");
            
            for (let insuranceAsset of this.insuranceAssets) {
                let client = await this.userRepository.getClient(insuranceAsset.owners[0]);
                let name = client.name.firstName + ' ' +client.name.lastName;
                let insuranceObject = {
                    "name": insuranceAsset.name,
                    "assetSubtype": insuranceAsset.assetSubtype,
                    "owner": name,
                    "currentValuation": insuranceAsset.currentValuation,
                }
                insurancePremium += insuranceAsset.currentValuation;
                this.emergencyFund.insurancePremiumBreakUp.push(insuranceObject);
            }
            this.emergencyFund.insurancePremium = Math.round(insurancePremium/12);
            
            this.emergencyFund.totalMonthlyExpense = this.emergencyFund.insurancePremium+this.emergencyFund.loanEMIServicing+this.emergencyFund.householdExpense;
            
        } catch (error) {
            throw error;
        }
    }

    calculateEmergencyFundRequired(){
        if (this.emergencyFund.emergencyPeriod){
            this.emergencyFund.emergencyFundRequired = this.emergencyFund.totalMonthlyExpense*this.emergencyFund.emergencyPeriod;
            let response = this.emergencyFundRepository.updateEmergencyFund(this.clientId,this.emergencyFund.emergencyFundRequired);
        }
    }

    configureCommittedRepayments(liabilities) {
        return Liability.calculateLiabilityDataForCashflow(liabilities);
    };

    autoCalculateEmergencyFundsRequired() {
        this.emergencyFundRequired = this.monthsToBudget * this.totalMonthyExpense;
    }


    didClickSelectOrDeselectAllExpensesCheckbox(event) {
        if (event.target.checked) {
            this.expenseBreakup.map((expense) => {
                expense.isSelected = true;
                return expense;
            });
        } else {
            this.expenseBreakup.map((expense) => {
                expense.isSelected = false;
                return expense;
            });
        }
    }


    didRecalculateEmergencyFundsRequired() {
        this.householdExpense = 0;
        this.expenseBreakup.filter((expense) => {
            if (expense.isSelected == true) {
                this.householdExpense += expense.amount;
                return expense;
            } else {
                this.isAllExpensesSelected = false;
            }
        });

        this.totalMonthyExpense = this.householdExpense + this.insurancePremiums + this.loanEMI;
        this.autoCalculateEmergencyFundsRequired();
    }


    displayCurrency(amount) {
        if (amount) {
            let formatter = new CurrencyFormatter();
            return formatter.currencyFormatter(amount);
        } else {
            return 0;
        }
    }


    displayExpenseType(category, kind) {
        return Expense.displayExpenseTypeName(category, kind);
    }


    displayLiabilityType(kind) {
        return LiabilityTypeUtils.getLiabilityTypeText(kind);
    }


    didRemovePadding() {
        let padding = new MaterialDialogPaddingRemover();
        return padding.didRemovePaddingForMaterialDialog();
    }

}
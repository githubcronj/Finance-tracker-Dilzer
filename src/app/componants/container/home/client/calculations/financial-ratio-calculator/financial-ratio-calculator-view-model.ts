import { Injectable } from '@angular/core';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { HttpService } from '../../../../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../../../../model/parsers/json-convert';
import { Liability } from '../../../../../../model/liability/liability';
import { Asset } from '../../../../../../model/asset/asset';
import { UserRepository } from '../../../../../../repository/user/user.repository';
import { CashflowRepository } from '../../../../../../repository/cashflow/cashflow.repository';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository';
import { MaterialDialogPaddingRemover } from '../../../../../../core/material-dialog-padding-remover';
import { AssetListViewModel } from '../../networth/assets/asset-list-view-model';

@Injectable()
export class FinancialRatioCalculatorViewModel {
    private model;
    public financialRatio = {
        'cashAsset':undefined,
        'liquidAsset': undefined,
        'monthlyExpense': undefined,
        'netWorth': undefined,
        'savings': undefined, 
        'netSalary': undefined,
        'totalLiabilities': undefined,
        'totalAssets': undefined,
        'annualDebtPayment': undefined,

        'cashAssetBreakUp':{},
        'liquidAssetBreakUp': {},
        'monthlyExpenseBreakUp': {},
        'netWorthBreakUp': {},
        'savingsBreakUp': {}, 
        'netSalaryBreakUp': {},
        'totalLiabilitiesBreakUp': {},
        'totalAssetsBreakUp': {},
        'annualDebtPaymentBreakUp': {},

        'cashAssetCurrencyFormat':undefined,
        'liquidAssetCurrencyFormat': undefined,
        'monthlyExpenseCurrencyFormat': undefined,
        'netWorthCurrencyFormat': undefined,
        'savingsCurrencyFormat': undefined, 
        'netSalaryCurrencyFormat': undefined,
        'totalLiabilitiesCurrencyFormat': undefined,
        'totalAssetsCurrencyFormat': undefined,
        'annualDebtPaymentCurrencyFormat': undefined,

        'basicLiquidityRatio': undefined,
        'expandedLiquidityRatio': undefined,
        'savingsRatio': undefined,
        'debtAssetRatio': undefined,
        'solvencyRatio': undefined,
        'debtServiceRatio': undefined

    };
    private cashInHand = 0;
    private CashInHandOBJ = [];

    private liquidAsset = 0;
    private LiquidAssetObj = [];

    private expense = 0;
    private ExpenseObj = [];

    private netWorth = 0;
    private NetWorthObj = [];

    private savings = 0;
    private SavingsObj = [];

    private income = 0;
    private IncomeObj = [];

    private liabilities = 0;
    private LiabilityObj = [];

    private totatAsset = 0;
    private TotalAssetObj = [];

    private debt = 0;
    private DebtObj = [];
    
    public clientId;
    public kind;
    public client;
    private currencyFormatter = new CurrencyFormatter();

    public cashAssetHeader = [ 'Name', 'Asset Sub Type', 'Value'];
    public liquidAssetHeader = [ 'Name', 'Value'];
    public monthlyExpenseHeader = [ 'Name', 'Value'];
    public netWorthHeader = [ 'Name', 'Value', 'Percentage'];
    public savingsHeader =  [ 'Name', 'Value'];
    public netSalaryHeader = [ 'Name', 'Value'];
    public totalLiabilitiesHeader = [ 'Name', 'Committed Repayment Type','Value']
    public totalAssetsHeader = [ 'Name', 'Value'];
    public annualDebtPaymentHeader = [ 'Name', 'kind', 'Committed Repayment Type','Amount'];
        
    constructor(
        private userRepository: UserRepository,
        private cashflowRepository: CashflowRepository,
        private networthRepository: NetworthRepository,
        private httpService: HttpService
    ) {

    }

    async getFinancialDetails(){
        try {
            this.reset();
            // Cash in hand
            let CashInHand = await this.networthRepository.getAssets(this.clientId,"CashInHand");
            for (let cih of CashInHand){
                let cashAssetObj = [
                    cih.name,
                    cih.assetSubtype,
                    '₹'+this.displayCurrency(Math.round(cih.currentValuation)),
                ];
                this.cashInHand += cih.currentValuation;
                this.CashInHandOBJ.push(cashAssetObj);
            }
            this.financialRatio.cashAssetBreakUp = {
                heading: 'Cash/Liquid Asset',
                header: this.cashAssetHeader,
                breakUpobj: this.CashInHandOBJ
            };
            this.financialRatio.cashAsset = Math.round(this.cashInHand);
            this.financialRatio.cashAssetCurrencyFormat = this.displayCurrency(this.financialRatio.cashAsset);

            // Liquid Asset
            let FinancialAssets = await this.networthRepository.getFinancialAssets(this.clientId);
            for (let FinancialAsset of FinancialAssets) {
                let financialAssetKindArray = ['NPS', 'CashInHand', 'EPF', 'MutualFunds', 'DirectEquity'];
                if (financialAssetKindArray.includes(FinancialAsset.kind)) {
                    let liquidAssetObj = [
                        FinancialAsset.kind,
                        '₹'+this.displayCurrency(Math.round(FinancialAsset.currentValuation))
                    ];
                    this.liquidAsset += FinancialAsset.currentValuation;
                    this.LiquidAssetObj.push(liquidAssetObj);
                };
            };
            this.financialRatio.liquidAsset = Math.round(this.liquidAsset);
            this.financialRatio.liquidAssetBreakUp = {
                heading: 'Liquid Assets',
                header: this.liquidAssetHeader,
                breakUpobj: this.LiquidAssetObj
            };
            this.financialRatio.liquidAssetCurrencyFormat = this.displayCurrency(this.financialRatio.liquidAsset);

            // Monthly Expense
            let Expense = await this.cashflowRepository.getExpenses(this.clientId);
            for (let exp of Expense) {
                let expenseObj = [
                    exp.kind,
                    '₹'+this.displayCurrency(Math.round(exp.currentLivingExpenses))
                ];
                this.expense += exp.currentLivingExpenses;
                this.ExpenseObj.push(expenseObj);
            };
            this.financialRatio.monthlyExpenseBreakUp = {
                heading: 'Monthly Expense',
                header: this.liquidAssetHeader,
                breakUpobj: this.ExpenseObj
            };
            this.financialRatio.monthlyExpense = Math.round(this.expense);
            this.financialRatio.monthlyExpenseCurrencyFormat = this.displayCurrency(this.financialRatio.monthlyExpense);

            // Networth
            let NetWorth = await this.networthRepository.getTotalNetworth(this.clientId);
            this.NetWorthObj = [[
                    'Financial Asset',
                    '₹'+this.displayCurrency(Math.round(NetWorth.financialAssets)),
                    parseInt(NetWorth.financialAssetsPercentage).toFixed(2)
                ],
                [
                    'Liabilities',
                    '₹'+this.displayCurrency(Math.round(NetWorth.liabilities)),
                    parseInt(NetWorth.liabilitiesPercentage).toFixed(2)
                ],
                [
                    'Other Asset',
                    '₹'+this.displayCurrency(Math.round(NetWorth.otherAssets)),
                    parseInt(NetWorth.otherAssetsPercentage).toFixed(2)
                ]
            ];
            this.financialRatio.netWorthBreakUp = {
                heading: 'Net Worth',
                header: this.netWorthHeader,
                breakUpobj: this.NetWorthObj
            };
            this.financialRatio.netWorth = Math.round(NetWorth.financialAssets+NetWorth.otherAssets-NetWorth.liabilities);
            this.financialRatio.netWorthCurrencyFormat = this.displayCurrency(this.financialRatio.netWorth);

            // Savings
            let Savings = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/asset`, null);
            const parser = new JsonConvert();
            Savings = parser.deserializeArray(Savings.assets, Asset);
            Savings = this.configureCommittedSavings(Savings);
            this.financialRatio.savings = Math.round(Savings.totalCommittedSavingAmount);
            Savings = Savings.committedSavings;
            for (let saving of Savings) {
                let savingObj = [
                    saving.name,
                    '₹'+this.displayCurrency(Math.round(saving.amount))
                ];
                this.SavingsObj.push(savingObj);
            };
            this.financialRatio.savingsBreakUp = {
                heading: 'Savings',
                header: this.savingsHeader,
                breakUpobj: this.SavingsObj
            };
            this.financialRatio.savingsCurrencyFormat = this.displayCurrency(this.financialRatio.savings);

            // Gross Inflow
            let Incomes = await this.cashflowRepository.getIncomes(this.clientId);
            for (let income of Incomes) {
                let incomeObj = [
                    income.kind,
                    '₹'+this.displayCurrency(Math.round(income.amount))
                ];
                this.income += income.amount;
                this.IncomeObj.push(incomeObj);
            };
            this.financialRatio.netSalary = Math.round(this.income);
            this.financialRatio.netSalaryCurrencyFormat = this.displayCurrency(this.financialRatio.netSalary);
            this.financialRatio.netSalaryBreakUp = {
                heading: 'Net Income',
                header: this.netSalaryHeader,
                breakUpobj: this.IncomeObj
            };

            // Total Liabilities
            let Liabilities = await this.networthRepository.getAllLiabilities(this.clientId);
            for (let liability of Liabilities) {
                let liabilityObj = [
                    liability.name,
                    liability.kind,
                    '₹'+this.displayCurrency(Math.round(liability.loanAmount))
                ];
                this.liabilities += liability.loanAmount;
                this.LiabilityObj.push(liabilityObj);
            };
            this.financialRatio.totalLiabilities = Math.round(this.liabilities);
            this.financialRatio.totalLiabilitiesCurrencyFormat = this.displayCurrency(this.financialRatio.totalLiabilities);
            this.financialRatio.totalLiabilitiesBreakUp = {
                heading: 'Liabilities',
                header: this.totalLiabilitiesHeader,
                breakUpobj: this.LiabilityObj
            }

            // Total Asset
            let OtherAssets = await this.networthRepository.getOtherAssets(this.clientId);
            for (let financialAsset of FinancialAssets) {
                let financialAssetObj = [
                    financialAsset.kind,
                    '₹'+this.displayCurrency(Math.round(financialAsset.currentValuation))
                ];
                this.totatAsset += financialAsset.currentValuation;
                this.TotalAssetObj.push(financialAssetObj);
            };
            for (let otherAsset of OtherAssets) {
                let otherAssetObj = [
                    otherAsset.kind,
                    otherAsset.currentValuation
                ];
                this.totatAsset += otherAsset.currentValuation;
                this.TotalAssetObj.push(otherAssetObj);
            };
            this.financialRatio.totalAssets = Math.round(this.totatAsset);
            this.financialRatio.totalAssetsCurrencyFormat = this.displayCurrency(this.financialRatio.totalAssets);
            this.financialRatio.totalAssetsBreakUp = {
                heading: 'Assets',
                header: this.totalAssetsHeader,
                breakUpobj: this.TotalAssetObj
            };

            // Debt Payment
            let Debts = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/liability`, null);
            Debts = Debts.liabilities;
            
            for (let debt of Debts) {
                let debtObj = [
                    debt.name,
                    debt.kind,
                    debt.committedRepayments[0].kind,
                    '₹'+this.displayCurrency(Math.round(debt.loanAmount)),
                ];
                this.debt += debt.loanAmount;
                this.DebtObj.push(debtObj);
            };
            this.financialRatio.annualDebtPayment = Math.round(this.debt);
            this.financialRatio.annualDebtPaymentCurrencyFormat = this.displayCurrency(this.financialRatio.annualDebtPayment);
            this.financialRatio.annualDebtPaymentBreakUp ={
                heading: 'Debt',
                header: this.annualDebtPaymentHeader,
                breakUpobj: this.DebtObj
            };

            // Ratios
            this.financialRatio.basicLiquidityRatio = parseFloat(String(this.financialRatio.cashAsset/this.financialRatio.monthlyExpense*100)).toFixed(2);
            this.financialRatio.expandedLiquidityRatio = parseFloat(String(this.financialRatio.liquidAsset/this.financialRatio.netWorth*100)).toFixed(2);
            this.financialRatio.savingsRatio = parseFloat(String(this.financialRatio.savings/this.financialRatio.netSalary*100)).toFixed(2);
            this.financialRatio.debtAssetRatio = parseFloat(String(this.financialRatio.totalLiabilities/this.financialRatio.totalAssets*100)).toFixed(2);
            this.financialRatio.solvencyRatio = parseFloat(String(this.financialRatio.netWorth/this.financialRatio.totalAssets*100)).toFixed(2);
            this.financialRatio.debtServiceRatio = parseFloat(String(this.financialRatio.annualDebtPayment/this.financialRatio.netSalary*100)).toFixed(2);
            // console.log('Financial Ratio-> ',this.financialRatio);

        } catch (error) {
            throw error;
        }
    };

    configureCommittedSavings(assets) {
        return Asset.calculateCommittedSavingsData(assets);
    };

    getTotalAssetCurrentValuation(Assets) {
        let kindDisplayString;
        let totalCurrentValuation = 0;
        let assetItems = [];
        for (let asset of Assets) {
            // assetItems.push(new AssetListViewModel(this.currencyFormatter, asset, this.clientDetails.ownerOfResourceList()))
            totalCurrentValuation += asset.currentValuation;
        }
        if (assetItems && Assets[0]) {
            kindDisplayString = Assets[0].assetTypeDisplayString;
        }
    
    };

    didRemovePadding() {
        let padding = new MaterialDialogPaddingRemover();
        return padding.didRemovePaddingForMaterialDialog();
    };

    displayCurrency(amount) {
        if (amount) {
            let formatter = new CurrencyFormatter();
            return formatter.currencyFormatter(amount);
        } else {
            return 0;
        }
    };
    reset() {
        this.cashInHand = 0;
        this.CashInHandOBJ = [];
    
        this.liquidAsset = 0;
        this.LiquidAssetObj = [];
    
        this.expense = 0;
        this.ExpenseObj = [];
    
        this.netWorth = 0;
        this.NetWorthObj = [];
    
        this.savings = 0;
        this.SavingsObj = [];
    
        this.income = 0;
        this.IncomeObj = [];
    
        this.liabilities = 0;
        this.LiabilityObj = [];
    
        this.totatAsset = 0;
        this.TotalAssetObj = [];
    
        this.debt = 0;
        this.DebtObj = [];
    };

}

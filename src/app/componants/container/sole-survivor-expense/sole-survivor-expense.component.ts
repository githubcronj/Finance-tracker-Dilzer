import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { FinanceService } from '../../../services/finance.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Expense } from '../../../model/expense/expense'
import { Goal } from '../../../model/goal/goal'
import { SoleSurvivorExpense } from '../../../model/goal/soleSurvivorExpense'
import { SoleSurvivorService } from '../../../services/soleSurvivor.service';

import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { FixedExpenseType, FixedExpenseTypeUtils } from '../../../model/enum/expense/fixed-expense-type';
import { DiscretionaryExpenseType, DiscretionaryExpenseTypeUtils } from '../../../model/enum/expense/discretionary-type.enum';
import { PersonalExpenseSubType, PersonalExpenseSubtypeTypeUtils } from '../../../model/enum/expense/personal-sub-type.enum';
import { FamilyCareExpenseSubType, FamilyCareExpenseSubTypeUtils } from '../../../model/enum/expense/family-care-sub-type.enum';
import { FoodExpenseSubType, FoodExpenseSubtypeTypeUtils } from '../../../model/enum/expense/food-sub-type.enum';
import { HousingExpenseSubType, HousingExpenseSubtypeTypeUtils } from '../../../model/enum/expense/housing-sub-type.enum';
import { HealthCareExpenseSubType, HealthCareExpenseSubtypeTypeUtils } from '../../../model/enum/expense/health-care-sub-type.enum';
import { MiscellaneousExpenseSubType, MiscellaneousExpenseSubTypeTypeUtils } from '../../../model/enum/expense/miscellaneous-sub-type.enum';
import { OtherExpenseSubType, OtherExpenseSubTypeUtils } from '../../../model/enum/expense/other-sub-type.enum';
import { PetExpenseSubType, PetExpenseSubTypeTypeUtils } from '../../../model/enum/expense/pet-expenses-sub-type.enum';
import { RecreationExpenseSubType, RecreationExpenseSubTypeUtils } from '../../../model/enum/expense/recreation-sub-type.enum';
import { TransportationExpenseSubType, TransportationExpenseSubTypeUtils } from '../../../model/enum/expense/transportation-sub-type.enum';
import { UtilityExpenseSubType, UtilityExpenseSubtypeTypeUtils } from '../../../model/enum/expense/utilities-sub-type.enum';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../../../model/enum/asset/committed-saving-frequency.enum'
import { ExpenseCategoryType, ExpenseCategoryTypeUtils } from '../../../model/enum/expense/expense-category-type.enum'
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { AddSoleSurvivorComponent } from '../add-sole-survivor/add-sole-survivor.component'
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-sole-survivor-expense',
    templateUrl: './sole-survivor-expense.component.html',
    styleUrls: ['./sole-survivor-expense.component.css']
})
export class SoleSurvivorExpenseComponent implements OnInit, AfterViewChecked {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @Output() saveSoleSurvivorExpense = new EventEmitter<any>();

    msgs = [];
    expenses = [];
    expenseCategoriesViewModels: ExpepenseCategoryViewModel[] = []
    clientId: string
    loadingOnSubmit = false;
    fixedExpenseTypeList = FixedExpenseTypeUtils.getAllFixedExpenseType();
    discretionaryexpenseTypeList = DiscretionaryExpenseTypeUtils.getAllDiscretionaryExpenseType();
    expenseFrequencyTypes = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
    expenseCategoryType = ExpenseCategoryTypeUtils.getAllExpenseCategoryType();
    isErrorOccured = false
    client: any
    inflationList = []
    expenseId
    checkedin = 0
    selectedExpense
    goalId
    goal;
    inflationRate;

    showExpenseErrorMessage = false

    private _parent: AddSoleSurvivorComponent;

    expenseForm = new FormGroup({
        inflationRateControl: new FormControl(null, [Validators.required])
    });

    constructor(private httpService: HttpService, private changeDetector: ChangeDetectorRef,
        private route: ActivatedRoute, private router: Router, private location: Location,
        private expenseService: FinanceService, private keyChainService: KeychainService, private soleSurvivorService: SoleSurvivorService,
        private messageService: MessageService
    ) {

    }


    async ngOnInit() {
        if (this.soleSurvivorService.inflationRate) {
            this.inflationRate = this.soleSurvivorService.inflationRate;
        }
        this.loadData()
    }


    ngAfterViewChecked() {
        if (this.selectedExpense) {

            const idView = document.querySelector('#' + this.selectedExpense.kind);

            if (idView && this.checkedin == 0) {
                this.checkedin = 1;
                idView.scrollIntoView()
                const inputFieldView = document.getElementById(this.selectedExpense.kind + this.selectedExpense.name + 'Amount')
                inputFieldView.focus();
            }
        }
    }

    async loadData() {


        for (let i = 6; i <= 10; i++) {
            this.inflationList.push(i)
        }

        const fixed = new ExpepenseCategoryViewModel()
        fixed.category = ExpenseCategoryType.Fixed
        this.expenseCategoriesViewModels.push(fixed)

        const discretionary = new ExpepenseCategoryViewModel()
        discretionary.category = ExpenseCategoryType.Discretionary
        this.expenseCategoriesViewModels.push(discretionary)


        this.clientId = this.route.snapshot.params['clientId'];
        this.expenseId = this.route.snapshot.params['expenseId'];
        this.goalId = this.route.snapshot.params['goalId'];

        this.navbar.routeBackTitle = 'Sole Survivor Expense';
        this.navbar.title = 'Add Sole Survivor Expense';
        this.navbar.isBorderEnabled = true;
        this.navbar.routeBackPath = `/auth/client/${this.clientId}/goal/${this.goalId}/sole-survivor`;

        this.messageService.sendMessage('show-loading');

        try {

            await this.getUserDetails();
            await this.getExpensesDetails();

            const iterators = []
            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.HousingExpense),
                "subtypes": HousingExpenseSubtypeTypeUtils.getAllHousingExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.UtilityExpense),
                "subtypes": UtilityExpenseSubtypeTypeUtils.getAllUtilityExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.PersonalExpense),
                "subtypes": PersonalExpenseSubtypeTypeUtils.getAllPersonalExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.FoodExpense),
                "subtypes": FoodExpenseSubtypeTypeUtils.getAllFoodExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.HealthCareExpense),
                "subtypes": HealthCareExpenseSubtypeTypeUtils.getAllHealthCareExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.FamilyCareExpense),
                "subtypes": FamilyCareExpenseSubTypeUtils.getAllFamilyCareExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Fixed,
                "kind": String(FixedExpenseType.TransportationExpense),
                "subtypes": TransportationExpenseSubTypeUtils.getAllTransportationExpenseSubType()
            })


            iterators.push({
                "category": ExpenseCategoryType.Discretionary,
                "kind": String(DiscretionaryExpenseType.RecreationExpense),
                "subtypes": RecreationExpenseSubTypeUtils.getAllRecreationExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Discretionary,
                "kind": String(DiscretionaryExpenseType.MiscellaneousExpense),
                "subtypes": MiscellaneousExpenseSubTypeTypeUtils.getAllMiscellaneousExpenseSubType()
            })


            iterators.push({
                "category": ExpenseCategoryType.Discretionary,
                "kind": String(DiscretionaryExpenseType.PetExpense),
                "subtypes": PetExpenseSubTypeTypeUtils.getAllPetExpenseSubType()
            })

            iterators.push({
                "category": ExpenseCategoryType.Discretionary,
                "kind": String(DiscretionaryExpenseType.OtherExpense),
                "subtypes": OtherExpenseSubTypeUtils.getAllOtherExpensesSubType()
            })

            for (let iterator of iterators) {

                let subtypes = iterator["subtypes"]
                let kind = iterator["kind"]
                let category = iterator["category"]

                const type = new ExpepenseTypeViewModel()
                type.kind = kind
                type.category = category

                for (let subtype of subtypes) {

                    let filteredExpenses = this.expenses.filter((ex) => {
                        if (ex.kind == kind && ex.subtype == subtype.key && ex.category == category) {
                            return true
                        } else {
                            return false
                        }
                    })

                    if (filteredExpenses.length > 0) {

                        for (let expense of filteredExpenses) {
                            expense._id = undefined
                            const vm = new ExpepenseViewModel()
                            vm.soleSurvivalExpense = expense
                            type.expenses.push(vm)
                        }

                    } else {

                        const expense = new SoleSurvivorExpense()
                        expense.kind = kind
                        expense.category = category
                        expense.subtype = subtype.key
                        expense.name = subtype.value
                        expense.frequency = CommittedSavingFrequencyType.Monthly

                        expense.lateRetirementExpensePercentage = 100
                        const vm = new ExpepenseViewModel()
                        vm.soleSurvivalExpense = expense
                        type.expenses.push(vm)

                    }


                }

                if (category == ExpenseCategoryType.Fixed) {
                    fixed.expenseTypes.push(type)
                } else {
                    discretionary.expenseTypes.push(type)
                }

            }
            this.changeDetector.detectChanges()

            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"
        }

    }


    retry() {
        this.loadData()
    }

    selectDeselectAll(event, expense, user) {

        const count = 0;
        if (event.target.checked) {
            expense.expenses.map((x) => {
                if (user == 'client') {
                    x.soleSurvivalExpense.isClientInsuranceNeedAnalysis = true
                } else {
                    x.soleSurvivalExpense.isSpouseInsuranceNeedAnalysis = true
                }
                return x
            });
        } else {

            expense.expenses.map((x) => {
                if (user == 'client') {
                    x.soleSurvivalExpense.isClientInsuranceNeedAnalysis = false
                } else {
                    x.soleSurvivalExpense.isSpouseInsuranceNeedAnalysis = false
                }
                return x

            });
        }
    }

    async getUserDetails() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.client = parser.deserialize(response.client, Client);
            this.navbar.subTitle = this.client.name.fullName();
        } catch (error) {
            throw error
        }
    }


    async getExpensesDetails() {
        try {

            const response = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/goal`, null);
            let parser = new JsonConvert()


            if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {
                const goalresponse = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/goal/${this.goalId}/sole-survivor-expense`, null);
                if (goalresponse && goalresponse.soleSurvivorExpenses != null && goalresponse.soleSurvivorExpenses.length > 0) {
                    this.expenses = parser.deserializeArray(goalresponse.soleSurvivorExpenses, SoleSurvivorExpense)
                }
            } else {
                const expenseResponse = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/expense`, null);
                this.expenses = parser.deserializeArray(expenseResponse.expenses, SoleSurvivorExpense)
            }

            this.soleSurvivorService.soleSurvivorExpenses = this.expenses

        } catch (error) {
            throw error
        }
    }

    async updateExpenses() {

    }


    routeBack() {
        this.navbar.routeBack()
    }

    calculateExpenseAmount(soleSurviorExpense) {

        if (soleSurviorExpense.lateRetirementExpensePercentage) {
            soleSurviorExpense.lateRetirementExpenseAmount = this.calculateAmountFromPercentage(soleSurviorExpense.lateRetirementExpensePercentage, soleSurviorExpense.earlyRetirementExpenseAmount)
        }
    }

    calculateLateRetirementExpenseAmount(soleSurviorExpense) {
        soleSurviorExpense.lateRetirementExpenseAmount = this.calculateAmountFromPercentage(soleSurviorExpense.lateRetirementExpensePercentage, soleSurviorExpense.earlyRetirementExpenseAmount)
    }
    calculateLateRetirementExpensePercentage(soleSurviorExpense) {
        soleSurviorExpense.lateRetirementExpensePercentage = this.calculatePercentageFromAmount(soleSurviorExpense.lateRetirementExpenseAmount, soleSurviorExpense.earlyRetirementExpenseAmount)
    }

    calculateAmountFromPercentage(percentage, amount) {
        return this.expenseService.calculateAmountFromPercentage(percentage, amount)
    }

    calculatePercentageFromAmount(expenseAmount, amount) {
        return this.expenseService.calculatePercentageFromAmount(expenseAmount, amount)
    }

    delete(expenseType: ExpepenseTypeViewModel, expenseViewModel: ExpepenseViewModel) {

        expenseType.expenses.splice(expenseType.expenses.indexOf(expenseViewModel), 1);

    }

    add(expenseType: ExpepenseTypeViewModel) {

        const expense = new SoleSurvivorExpense()
        expense.kind = expenseType.kind
        expense.category = expenseType.category
        expense.lateRetirementExpensePercentage = 100

        if (expense.category == ExpenseCategoryType.Fixed) {

            if (expense.kind == String(FixedExpenseType.HousingExpense)) {
                expense.subtype = HousingExpenseSubType.Other
            } else if (expense.kind == String(FixedExpenseType.UtilityExpense)) {
                expense.subtype = UtilityExpenseSubType.Other
            } else if (expense.kind == String(FixedExpenseType.PersonalExpense)) {
                expense.subtype = PersonalExpenseSubType.Other
            } else if (expense.kind == String(FixedExpenseType.FoodExpense)) {
                expense.subtype = FoodExpenseSubType.Other
            } else if (expense.kind == String(FixedExpenseType.HealthCareExpense)) {
                expense.subtype = HealthCareExpenseSubType.Other
            } else if (expense.kind == String(FixedExpenseType.FamilyCareExpense)) {
                expense.subtype = FamilyCareExpenseSubType.Other
            } else {
                expense.subtype = TransportationExpenseSubType.Other
            }


        } else {

            if (expense.kind == String(DiscretionaryExpenseType.RecreationExpense)) {
                expense.subtype = RecreationExpenseSubType.Other
            } else if (expense.kind == String(DiscretionaryExpenseType.MiscellaneousExpense)) {
                expense.subtype = MiscellaneousExpenseSubType.Other
            } else if (expense.kind == String(DiscretionaryExpenseType.PetExpense)) {
                expense.subtype = PetExpenseSubType.Other
            } else {
                expense.subtype = OtherExpenseSubType.Other
            }
        }

        expense.frequency = CommittedSavingFrequencyType.Monthly

        let expenseViewModel = new ExpepenseViewModel()
        expenseViewModel.soleSurvivalExpense = expense

        expenseType.expenses.push(expenseViewModel)

    }


    async save() {
        let validationSucceded = true;
        let expensesToAdd: SoleSurvivorExpense[] = []



        for (let cat of this.expenseCategoriesViewModels) {
            for (let type of cat.expenseTypes) {

                for (let expense of type.expenses) {

                    if (expense.soleSurvivalExpense.earlyRetirementExpenseAmount) {
                        expensesToAdd.push(expense.soleSurvivalExpense)
                    }

                    if (expense && !expense.soleSurvivalExpense.name) {
                        expense.soleSurvivalExpense.isNameEmpty = true
                        validationSucceded = false;

                    }
                }

            }
        }

        if (validationSucceded) {
            this.showExpenseErrorMessage = false
            if (expensesToAdd.length > 0) {
                this.loadingOnSubmit = true;

                try {
                    this.soleSurvivorService.soleSurvivorExpenses = expensesToAdd
                    this.soleSurvivorService.inflationRate = this.inflationRate;
                    this.didClickCancelButton();
                    this.loadingOnSubmit = false;
                } catch (error) {

                    this.loadingOnSubmit = false;

                    if (error.message) {
                        this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                    } else {
                        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                    }
                }

            } else {
                this.showExpenseErrorMessage = true
            }
        }



    }

    didClickCancelButton() {
        this.router.navigate(['auth/client/' + this.clientId + '/goal/' + this.goalId + '/sole-survivor'])
    }

}


class ExpepenseViewModel {

    soleSurvivalExpense: SoleSurvivorExpense

    isEditable() {

        if (this.soleSurvivalExpense.category == ExpenseCategoryType.Fixed) {

            if (this.soleSurvivalExpense.kind == String(FixedExpenseType.HousingExpense)) {
                if (this.soleSurvivalExpense.subtype == HousingExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(FixedExpenseType.UtilityExpense)) {
                if (this.soleSurvivalExpense.subtype == UtilityExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(FixedExpenseType.PersonalExpense)) {
                if (this.soleSurvivalExpense.subtype == PersonalExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(FixedExpenseType.FoodExpense)) {
                if (this.soleSurvivalExpense.subtype == FoodExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(FixedExpenseType.HealthCareExpense)) {
                if (this.soleSurvivalExpense.subtype == HealthCareExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(FixedExpenseType.FamilyCareExpense)) {
                if (this.soleSurvivalExpense.subtype == FamilyCareExpenseSubType.Other) {
                    return true
                }
            } else {
                if (this.soleSurvivalExpense.subtype == TransportationExpenseSubType.Other) {
                    return true
                }
            }


        } else {

            if (this.soleSurvivalExpense.kind == String(DiscretionaryExpenseType.RecreationExpense)) {
                if (this.soleSurvivalExpense.subtype == RecreationExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(DiscretionaryExpenseType.MiscellaneousExpense)) {
                if (this.soleSurvivalExpense.subtype == MiscellaneousExpenseSubType.Other) {
                    return true
                }
            } else if (this.soleSurvivalExpense.kind == String(DiscretionaryExpenseType.PetExpense)) {
                if (this.soleSurvivalExpense.subtype == PetExpenseSubType.Other) {
                    return true
                }
            } else {
                if (this.soleSurvivalExpense.subtype == OtherExpenseSubType.Other) {
                    return true
                }
            }
        }


        return false


    }

}

class ExpepenseTypeViewModel {

    kind: string
    category: ExpenseCategoryType
    expenses: ExpepenseViewModel[] = []

    displayName(category) {
        if (category == ExpenseCategoryType.Fixed) {
            return FixedExpenseTypeUtils.getFixedExpenseTypeText(this.kind)
        } else {
            return DiscretionaryExpenseTypeUtils.getDiscretionaryExpenseTypeText(this.kind)
        }
    }
}

class ExpepenseCategoryViewModel {

    category: ExpenseCategoryType
    expenseTypes: ExpepenseTypeViewModel[] = []

    displayName() {
        return ExpenseCategoryTypeUtils.getExpenseCategoryTypeText(this.category)
    }

}



import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { FinanceService } from '../../../services/finance.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Expense } from '../../../model/expense/expense'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { FixedExpenseType, FixedExpenseTypeUtils } from '../../../model/enum/expense/fixed-expense-type';
import { DiscretionaryExpenseType, DiscretionaryExpenseTypeUtils } from '../../../model/enum/expense/discretionary-type.enum';
import { AddExpenseTranslations } from './add-expense.translations';
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
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.css']
})


export class AddExpenseComponent implements OnInit, AfterViewChecked {

    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    msgs = [];
    expenses: Expense[];
    expenseCategoriesViewModels: ExpepenseCategoryViewModel[] = []
    clientId: string
    loadingOnSubmit = false;
    expenseTranslations = AddExpenseTranslations;
    fixedExpenseTypeList = FixedExpenseTypeUtils.getAllFixedExpenseType();
    discretionaryexpenseTypeList = DiscretionaryExpenseTypeUtils.getAllDiscretionaryExpenseType();
    expenseFrequencyTypes = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
    expenseCategoryType = ExpenseCategoryTypeUtils.getAllExpenseCategoryType();
    isErrorOccured = true
    client: any
    inflationList = []
    expenseType;
    checkedin = 0
    selectedExpense

    showExpenseErrorMessage = false


    expenseForm = new FormGroup({
        inflationRateControl: new FormControl(null, [Validators.required])
    });

    constructor(private httpService: HttpService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
        private route: ActivatedRoute, private router: Router, private location: Location,
        private expenseService: FinanceService, private keyChainService: KeychainService) {

    }


    async ngOnInit() {
        this.loadData()
    }

    ngAfterViewChecked() {
        if (this.expenseType) {

            const idView = document.querySelector('#' + this.expenseType);

            if (idView && this.checkedin == 0) {
                this.checkedin = 1;
                idView.scrollTo(20, 0)
                const inputFieldView = document.getElementById(this.expenseType + this.selectedExpense.name + 'Amount')
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
        this.expenseType = this.route.snapshot.params['expenseId'];
        this.navbar.routeBackTitle = 'Expenses';
        this.navbar.title = 'Add Expenses';
        this.navbar.isBorderEnabled = true;

        if (this.keyChainService.isLoggedInAsAdmin()) {

            this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

        } else {
            this.navbar.routeBackPath = "/auth/home";

        }
        this.navbar.routeBackQueryParams = { selected: 3, selectedSubIndex: 2 };

        try {
            this.messageService.sendMessage('show-loading');

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
                            vm.expense = expense
                            type.expenses.push(vm)
                        }

                    } else {

                        const expense = new Expense()
                        expense.kind = kind
                        expense.category = category
                        expense.subtype = subtype.key
                        expense.name = subtype.value
                        expense.frequency = CommittedSavingFrequencyType.Monthly
                        expense.earlyRetirementExpensePercentage = 100
                        expense.lateRetirementExpensePercentage = 100
                        const vm = new ExpepenseViewModel()
                        vm.expense = expense
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
        }

    }

    selectDeselectAll(event, expense, user) {

        const count = 0;
        if (event.target.checked) {

            expense.expenses.map((x) => {
                if (user == 'client') {
                    x.expense.isClientInsuranceNeedAnalysis = true
                } else {
                    x.expense.isSpouseInsuranceNeedAnalysis = true
                }
                return x
            });
        } else {

            expense.expenses.map((x) => {
                if (user == 'client') {
                    x.expense.isClientInsuranceNeedAnalysis = false
                } else {
                    x.expense.isSpouseInsuranceNeedAnalysis = false
                }
                return x

            });
        }
    }

    retry() {
        this.loadData()
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

            const response = await this.httpService.request(RequestMethod.Get, `client/${this.clientId}/expense`, null);
            let parser = new JsonConvert()
            this.expenses = parser.deserializeArray(response.expenses, Expense)
            this.selectedExpense = this.expenses.find(expense => expense.kind == this.expenseType)

        } catch (error) {
            throw error
        }
    }

    async updateExpenses() {

    }


    routeBack() {
        this.navbar.routeBack()
    }

    calculateExpenseAmount(expense) {
        if (expense.earlyRetirementExpensePercentage) {
            expense.earlyRetirementExpenseAmount = this.calculateAmountFromPercentage(expense.earlyRetirementExpensePercentage, expense.amount)
        }

        if (expense.lateRetirementExpensePercentage) {
            expense.lateRetirementExpenseAmount = this.calculateAmountFromPercentage(expense.lateRetirementExpensePercentage, expense.amount)
        }
    }
    calculateEarlyRetirementExpenseAmount(expense) {
        expense.earlyRetirementExpenseAmount = this.calculateAmountFromPercentage(expense.earlyRetirementExpensePercentage, expense.amount)
    }
    calculateEarlyRetirementExpensePercentage(expense) {
        expense.earlyRetirementExpensePercentage = this.calculatePercentageFromAmount(expense.earlyRetirementExpenseAmount, expense.amount)
    }

    calculateLateRetirementExpenseAmount(expense) {
        expense.lateRetirementExpenseAmount = this.calculateAmountFromPercentage(expense.lateRetirementExpensePercentage, expense.amount)
    }
    calculateLateRetirementExpensePercentage(expense) {
        expense.lateRetirementExpensePercentage = this.calculatePercentageFromAmount(expense.lateRetirementExpenseAmount, expense.amount)
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

        const expense = new Expense()
        expense.kind = expenseType.kind
        expense.category = expenseType.category
        expense.earlyRetirementExpensePercentage = 100
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
        expenseViewModel.expense = expense

        expenseType.expenses.push(expenseViewModel)

    }


    async save() {
        let validationSucceded = true;
        let expensesToAdd: Expense[] = []

        if (this.client && this.client.expenseInflationRate == null) {
            this.expenseForm.controls['inflationRateControl'].setErrors({ 'required': true });
            this.expenseForm.controls['inflationRateControl'].markAsTouched();
            validationSucceded = false;
        }

        for (let cat of this.expenseCategoriesViewModels) {
            for (let type of cat.expenseTypes) {

                for (let expense of type.expenses) {

                    if (expense.expense.amount) {
                        expensesToAdd.push(expense.expense)
                    }

                    if (expense && !expense.expense.name) {
                        expense.expense.isNameEmpty = true
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

                    const response = await this.httpService.request(RequestMethod.Post, 'client/' + this.clientId + '/expense', { expenseInflationRate: this.client.expenseInflationRate, expenses: expensesToAdd });
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
        this.navbar.routeBack()
    }

}


class ExpepenseViewModel {

    expense: Expense

    isEditable() {

        if (this.expense.category == ExpenseCategoryType.Fixed) {

            if (this.expense.kind == String(FixedExpenseType.HousingExpense)) {
                if (this.expense.subtype == HousingExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(FixedExpenseType.UtilityExpense)) {
                if (this.expense.subtype == UtilityExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(FixedExpenseType.PersonalExpense)) {
                if (this.expense.subtype == PersonalExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(FixedExpenseType.FoodExpense)) {
                if (this.expense.subtype == FoodExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(FixedExpenseType.HealthCareExpense)) {
                if (this.expense.subtype == HealthCareExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(FixedExpenseType.FamilyCareExpense)) {
                if (this.expense.subtype == FamilyCareExpenseSubType.Other) {
                    return true
                }
            } else {
                if (this.expense.subtype == TransportationExpenseSubType.Other) {
                    return true
                }
            }


        } else {

            if (this.expense.kind == String(DiscretionaryExpenseType.RecreationExpense)) {
                if (this.expense.subtype == RecreationExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(DiscretionaryExpenseType.MiscellaneousExpense)) {
                if (this.expense.subtype == MiscellaneousExpenseSubType.Other) {
                    return true
                }
            } else if (this.expense.kind == String(DiscretionaryExpenseType.PetExpense)) {
                if (this.expense.subtype == PetExpenseSubType.Other) {
                    return true
                }
            } else {
                if (this.expense.subtype == OtherExpenseSubType.Other) {
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








import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Admin } from '../../../model/admin';
import { Client } from '../../../model/client';
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { soleSurvivorTranslations } from './add-sole-survivor.translations';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../../../model/enum/asset/committed-saving-frequency.enum'
import { nearer } from 'q';
import { SoleSurvivorAmountBreakdownType, SoleSurvivorAmountBreakdownTypeUtils } from './soleSurvivorAmountBreakdownType.enum'
import { SoleSurvivor } from '../../../model/goal/soleSurvivor';
import { CopyExpenseFromType, CopyExpenseFromTypeUtils } from './copyExpenseFrom.enum'
import { Goal } from '../../../model/goal/goal';
import { SoleSurvivorExpenseComponent } from '../sole-survivor-expense/sole-survivor-expense.component';
import { SoleSurvivorService } from '../../../services/soleSurvivor.service';
import { TypeOfExpense, TypeOfExpenseUtils } from './typeOfExpense.enum'
import { MessageService } from '../../../services/message.service';



@Component({
  selector: 'app-add-sole-survivor',
  templateUrl: './add-sole-survivor.component.html',
  styleUrls: ['./add-sole-survivor.component.css']
})

export class AddSoleSurvivorComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  loadingOnSubmit = false;
  ownerOfResourceList = [];
  clientId;
  blockHeader = 'Add Sole Survivor';
  addUpdateSoleSurvivorButtonText = 'Add';
  clientDetails: any
  msgs = [];
  isErrorOccured = false
  translations = soleSurvivorTranslations
  frequencyType = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
  amountBreakDownType = SoleSurvivorAmountBreakdownTypeUtils.getAllSoleSurvivorAmountBreakdownType();
  copyExpenseFromType = CopyExpenseFromTypeUtils.getAllCopyExpenseFromType();
  typeOfExpense = TypeOfExpenseUtils.getAllTypeOfExpense()
  soleSurvivorId;
  goalId;
  soleSurvivor = new SoleSurvivor()
  goal = new Goal();
  inflationList = []
  AmtBreakdownType = SoleSurvivorAmountBreakdownType
  showSoleSurvivorExpense = false


  soleSurvivorForm = new FormGroup({
    amountControl: new FormControl(null, [Validators.required]),
    frequencyControl: new FormControl(null, [Validators.required]),
    inflationRateControl: new FormControl(null, [Validators.required]),
    amountBreakdownControl: new FormControl(null),
    copyExpenseFromControl: new FormControl(null),
    typeOfExpenseControl: new FormControl(null)
  });


  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private changeDetector: ChangeDetectorRef,
    private keyChainService: KeychainService,
    private soleSurvivorService: SoleSurvivorService,
    private messageService: MessageService
  ) { }


  async ngOnInit() {
    this.loadData()

  }

  async loadData() {
    for (let i = 6; i <= 10; i++) {
      this.inflationList.push(i)
    }

    try {

      this.clientId = this.route.snapshot.params['clientId'];
      this.goalId = this.route.snapshot.params['goalId'];

      this.navbar.routeBackTitle = 'Goals';
      this.navbar.title = 'Add Sole Survivor';
      this.navbar.isBorderEnabled = true;


      this.navbar.routeBackPath = `/auth/client/${this.clientId}/goal/${this.goalId}`;

      this.addUpdateSoleSurvivorButtonText = 'Save';

      this.messageService.sendMessage('show-loading');
      await this.getUserDetails();
      await this.getSoleSurvivorDetails();
      this.isErrorOccured = false;
      this.messageService.sendMessage('hide-loading');
    } catch (error) {
      this.isErrorOccured = true
      this.messageService.sendMessage('hide-loading');
      this.changeDetector.detectChanges()

      this.errorHandling.message = error.message

    }
  }

  retry() {
    this.loadData()
  }

  async getUserDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.clientDetails = parser.deserialize(response.client, Client);
      this.ownerOfResourceList = this.clientDetails.ownerOfResourceList();
    } catch (error) {
      throw error
    }
  }

  async getSoleSurvivorDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/goal/' + this.goalId, null);
      const parser = new JsonConvert()
      this.goal = parser.deserialize(response.goal, Goal);
      this.navbar.subTitle = this.goal.name + ' of ' + this.clientDetails.name.fullName();
      this.soleSurvivor = this.goal.soleSurvivor

      if (this.soleSurvivor._id) {

        if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {

          this.soleSurvivor.amount = this.getSoleSurvivorEarlyRetirementExpenses()
          if (this.soleSurvivorService.inflationRate != null) {
            this.soleSurvivor.inflationRate = this.soleSurvivorService.inflationRate;
          }
          this.soleSurvivor.amountBreakdownType = SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown
          this.soleSurvivor.typeOfExpense = TypeOfExpense.EarlyRetirementExpense
        } else {

          this.soleSurvivorService.inflationRate = this.soleSurvivor.inflationRate

          if (this.soleSurvivor.soleSurvivorExpenses != null && this.soleSurvivor.soleSurvivorExpenses.length > 0) {
            this.soleSurvivorService.soleSurvivorExpenses = this.soleSurvivor.soleSurvivorExpenses
          }

          if (this.soleSurvivor.amountBreakdownType == null) {
            this.soleSurvivor.amountBreakdownType = SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal
          }

          if (this.soleSurvivor.expensesCopiedFrom == null) {

            this.soleSurvivor.expensesCopiedFrom = CopyExpenseFromType.LateRetirementLivingExpenses

          }

          if (this.soleSurvivor.amount == null) {
            await this.getLateRetirementExpense();
          }

          if (!this.soleSurvivor.inflationRate) {
            this.soleSurvivor.inflationRate = this.clientDetails.expenseInflationRate
          }

        }
      } else {

        if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {

          this.soleSurvivor.amountBreakdownType = SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown
          this.soleSurvivor.typeOfExpense = TypeOfExpense.EarlyRetirementExpense
          this.soleSurvivor.amount = this.getSoleSurvivorEarlyRetirementExpenses()
          this.soleSurvivor.inflationRate = this.soleSurvivorService.inflationRate;
        } else {



          if (this.soleSurvivor.amountBreakdownType == null) {

            this.soleSurvivor.amountBreakdownType = SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal
          }

          if (this.soleSurvivor.amountBreakdownType == SoleSurvivorAmountBreakdownType.AmountViaEstimatedTotal) {

            if (this.soleSurvivor.expensesCopiedFrom == null) {
              this.soleSurvivor.expensesCopiedFrom = CopyExpenseFromType.LateRetirementLivingExpenses
            }

            if (this.soleSurvivor.amount == null) {
              await this.getLateRetirementExpense();
            }

            if (this.soleSurvivor.inflationRate == null) {
              this.soleSurvivor.inflationRate = this.clientDetails.expenseInflationRate;
            }

          }
        }


      }
    } catch (error) {
      throw error
    }
  }


  async getEarlyRetirementExpense() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/total-early-retirement-expense', null);
      if (response.amount != null) {
        this.soleSurvivor.amount = response.amount
      }
    } catch (error) {
      throw error
    }

  }

  async getMidRetirementExpense() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/total-mid-retirement-expense', null);
      if (response.amount != null) {
        this.soleSurvivor.amount = response.amount
      }
    } catch (error) {
      throw error
    }
  }

  async getLateRetirementExpense() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/total-late-retirement-expense', null);
      if (response.amount != null) {
        this.soleSurvivor.amount = response.amount
      }
    } catch (error) {
      throw error
    }
  }

  async getCurrentLivingExpense() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/total-current-living-expenses', null);
      if (response.amount != null) {
        this.soleSurvivor.amount = response.amount
      }
    } catch (error) {
      throw error
    }

  }

  getSoleSurvivorEarlyRetirementExpenses() {

    let totalSoleSurvivorEarlyRetirementExpenses = 0
    for (let expense of this.soleSurvivorService.soleSurvivorExpenses) {

      if (expense.frequency != null) {

        if (expense.frequency == CommittedSavingFrequencyType.Yearly) {
          totalSoleSurvivorEarlyRetirementExpenses += expense.earlyRetirementExpenseAmount
        } else if (expense.frequency == CommittedSavingFrequencyType.Monthly) {
          totalSoleSurvivorEarlyRetirementExpenses += (expense.earlyRetirementExpenseAmount * 12)
        } else if (expense.frequency == CommittedSavingFrequencyType.Quarterly) {
          totalSoleSurvivorEarlyRetirementExpenses += (expense.earlyRetirementExpenseAmount * 4)
        } else if (expense.frequency == CommittedSavingFrequencyType.HalfYearly) {
          totalSoleSurvivorEarlyRetirementExpenses += (expense.earlyRetirementExpenseAmount * 2)
        }

      } else {
        totalSoleSurvivorEarlyRetirementExpenses += expense.earlyRetirementExpenseAmount
      }
    }
    return totalSoleSurvivorEarlyRetirementExpenses

  }

  getSoleSurvivorMidRetirementExpenses() {

    let totalSoleSurvivorMidRetirementExpenses = 0
    for (let expense of this.soleSurvivorService.soleSurvivorExpenses) {

      if (expense.frequency != null) {

        if (expense.frequency == CommittedSavingFrequencyType.Yearly) {
          totalSoleSurvivorMidRetirementExpenses += expense.midRetirementExpenseAmount
        } else if (expense.frequency == CommittedSavingFrequencyType.Monthly) {
          totalSoleSurvivorMidRetirementExpenses += (expense.midRetirementExpenseAmount * 12)
        } else if (expense.frequency == CommittedSavingFrequencyType.Quarterly) {
          totalSoleSurvivorMidRetirementExpenses += (expense.midRetirementExpenseAmount * 4)
        } else if (expense.frequency == CommittedSavingFrequencyType.HalfYearly) {
          totalSoleSurvivorMidRetirementExpenses += (expense.midRetirementExpenseAmount * 2)
        }

      } else {
        totalSoleSurvivorMidRetirementExpenses += expense.midRetirementExpenseAmount
      }
    }
    return totalSoleSurvivorMidRetirementExpenses

  }

  getSoleSurvivorLateRetirementExpenses() {

    let totalSoleSurvivorLateRetirementExpenses = 0
    for (let expense of this.soleSurvivorService.soleSurvivorExpenses) {

      if (expense.frequency != null) {

        if (expense.frequency == CommittedSavingFrequencyType.Yearly) {
          totalSoleSurvivorLateRetirementExpenses += expense.lateRetirementExpenseAmount
        } else if (expense.frequency == CommittedSavingFrequencyType.Monthly) {
          totalSoleSurvivorLateRetirementExpenses += (expense.lateRetirementExpenseAmount * 12)
        } else if (expense.frequency == CommittedSavingFrequencyType.Quarterly) {
          totalSoleSurvivorLateRetirementExpenses += (expense.lateRetirementExpenseAmount * 4)
        } else if (expense.frequency == CommittedSavingFrequencyType.HalfYearly) {
          totalSoleSurvivorLateRetirementExpenses += (expense.lateRetirementExpenseAmount * 2)
        }

      } else {
        totalSoleSurvivorLateRetirementExpenses += expense.lateRetirementExpenseAmount
      }
    }
    return totalSoleSurvivorLateRetirementExpenses

  }


  setSoleSurvivorExpenseStartAndEndDate() {
    const clientLifeSpan = new Date(this.clientDetails.dob);
    clientLifeSpan.setFullYear(clientLifeSpan.getFullYear() + this.clientDetails.lifeExpectancy);

    const spouseLifeSpan = new Date(this.clientDetails.spouse.dob);
    spouseLifeSpan.setFullYear(spouseLifeSpan.getFullYear() + this.clientDetails.spouse.lifeExpectancy);
    let soleSurvivorStartDate
    let soleSurvivorEndDate
    if (clientLifeSpan > spouseLifeSpan) {
      soleSurvivorStartDate = spouseLifeSpan
      soleSurvivorEndDate = clientLifeSpan
    } else if (clientLifeSpan < spouseLifeSpan) {
      soleSurvivorStartDate = clientLifeSpan
      soleSurvivorEndDate = spouseLifeSpan
    }

    this.soleSurvivor.soleSurvivorExpenseStartDate = soleSurvivorStartDate
    this.soleSurvivor.soleSurvivorExpenseEndDate = soleSurvivorEndDate
  }

  async didAddSoleSurvivor() {
    let validationSucceded = true;

    if (this.soleSurvivor && !this.soleSurvivor.amount) {
      this.soleSurvivorForm.controls['amountControl'].setErrors({ 'required': true });
      this.soleSurvivorForm.controls['amountControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.soleSurvivor && !this.soleSurvivor.inflationRate) {
      this.soleSurvivorForm.controls['inflationRateControl'].setErrors({ 'required': true });
      this.soleSurvivorForm.controls['inflationRateControl'].markAsTouched();
      validationSucceded = false;
    }


    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;

      this.setSoleSurvivorExpenseStartAndEndDate()
      if (this.soleSurvivorId) {
        url = 'client/' + this.clientId + '/goal/' + this.goalId + '/sole-survivor/' + this.soleSurvivorId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/goal/' + this.goalId + '/sole-survivor';
        method = RequestMethod.Post;
      }

      try {

        if (this.soleSurvivor.amountBreakdownType == SoleSurvivorAmountBreakdownType.AmountViaExpenseBreakdown) {
          this.soleSurvivor.soleSurvivorExpenses = this.soleSurvivorService.soleSurvivorExpenses
          this.soleSurvivor.expensesCopiedFrom = undefined
        } else {
          this.clearSoleSurvivorServiceExpensesObjects()
          this.soleSurvivor.soleSurvivorExpenses = undefined
        }
        const response = await this.httpService.request(method, url, this.soleSurvivor);
        this.loadingOnSubmit = false;
        this.didClickCancelButton();

      } catch (error) {

        this.loadingOnSubmit = false;
        if (error.message) {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        } else {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
        }

      }
    }
  }

  clearSoleSurvivorServiceExpensesObjects() {
    if (this.soleSurvivorService != undefined) {
      this.soleSurvivorService.soleSurvivorExpenses = undefined
      this.soleSurvivorService.inflationRate = undefined
      this.soleSurvivorService = undefined
    }

  }

  didClickCancelButton() {
    this.clearSoleSurvivorServiceExpensesObjects()
    this.navbar.routeBack()
  }


  didChangeCopyFromExpense(event) {
    if (event.target.value == CopyExpenseFromType.RetirementLivingExpenses) {
      this.getEarlyRetirementExpense()
    } else if (event.target.value == CopyExpenseFromType.CurrentLivingExpenses) {
      this.getCurrentLivingExpense()
    } else {
      this.getLateRetirementExpense()
    }
  }

  didChangeAmountBreakdownType(event) {
    this.soleSurvivorService.inflationRate = this.soleSurvivor.inflationRate
    if (event.target.value == "1") {
      if (this.soleSurvivor.soleSurvivorExpenses != null && this.soleSurvivor.soleSurvivorExpenses.length > 0) {
        this.soleSurvivorService.soleSurvivorExpenses = this.soleSurvivor.soleSurvivorExpenses
      } else {
        this.soleSurvivorService.soleSurvivorExpenses = undefined
      }

      this.soleSurvivor.typeOfExpense = TypeOfExpense.LateRetirementExpense
      if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {
        this.getSoleSurvivorEarlyRetirementExpenses()
      } else {
        this.getLateRetirementExpense()
      }

      //this.router.navigate(['/auth/client/' + this.clientId + '/goal/' + this.goalId + '/retirement/sole-survior-expenses']);
    } else {

      if (this.soleSurvivor.expensesCopiedFrom == null) {
        this.soleSurvivor.expensesCopiedFrom = CopyExpenseFromType.LateRetirementLivingExpenses
      }

      if (this.soleSurvivor.expensesCopiedFrom == CopyExpenseFromType.RetirementLivingExpenses) {
        this.getEarlyRetirementExpense()
      } else if (this.soleSurvivor.expensesCopiedFrom == CopyExpenseFromType.CurrentLivingExpenses) {
        this.getCurrentLivingExpense()
      } {
        this.getLateRetirementExpense()
      }

    }
  }

  editExpenseBreakdown() {
    this.soleSurvivorService.inflationRate = this.soleSurvivor.inflationRate
    if (this.soleSurvivor.soleSurvivorExpenses != null && this.soleSurvivor.soleSurvivorExpenses.length > 0) {
      this.soleSurvivorService.soleSurvivorExpenses = this.soleSurvivor.soleSurvivorExpenses
    } else {
      // this.clearSoleSurvivorServiceExpensesObjects()
      this.soleSurvivorService.soleSurvivorExpenses = undefined
      this.soleSurvivorService = undefined
    }

    this.router.navigate(['/auth/client/' + this.clientId + '/goal/' + this.goalId + '/retirement/sole-survior-expenses']);
  }

  didChangeTypeOfExpense(event) {
    if (event.target.value == String(TypeOfExpense.EarlyRetirementExpense)) {

      if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {
        this.soleSurvivor.amount = this.getSoleSurvivorEarlyRetirementExpenses()
      } else {
        this.getEarlyRetirementExpense()
      }


    } else {

      if (this.soleSurvivorService.soleSurvivorExpenses != null && this.soleSurvivorService.soleSurvivorExpenses.length > 0) {
        this.soleSurvivor.amount = this.getSoleSurvivorLateRetirementExpenses()
      } else {
        this.getLateRetirementExpense()
      }

    }
  }

}
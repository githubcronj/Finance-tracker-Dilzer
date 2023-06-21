import { Component, OnInit, ViewChild, ViewChildren, ChangeDetectorRef, AfterViewInit, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpService } from '../../../services/http.service';
import { FinanceService } from '../../../services/finance.service';
import { RequestMethod } from '@angular/http';
import { CommittedRepayment } from '../../../model/committedRepayment';
import { Client } from '../../../model/client';
import { Liability } from '../../../model/liability/liability';
import { CommittedSavingType, CommittedSavingTypeUtils } from '../../../model/enum/asset/committed-saving.enum';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { KeychainService } from '../../../services/keychain.service';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../../../model/enum/asset/committed-saving-frequency.enum'
import { CommittedRepaymentTranslations } from './committed-repayment.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { DatePickerModule } from '../date-picker/date-picker.module'
import { DatePickerComponent } from '../date-picker/date-picker.component'
import * as moment from 'moment';
import { DatePickerType } from 'app/componants/container/date-picker/date-picker.enum';
import * as DateDiff from 'date-diff';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-committed-repayment',
  templateUrl: './committed-repayment.component.html',
  styleUrls: ['./committed-repayment.component.css']
})
export class CommittedRepaymentComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  @ViewChildren('lumpsumStartDatePicker') lumpsumStartDatePickers: QueryList<DatePickerComponent>;
  @ViewChildren('regularStartDatePicker') regularStartDatePickers: QueryList<DatePickerComponent>;
  @ViewChildren('regularEndDatePicker') regularEndDatePickers: QueryList<DatePickerComponent>;
  lumpsumStartDatePicker: DatePickerComponent;
  regularStartDatePicker: DatePickerComponent;
  regularEndDatePicker: DatePickerComponent;

  tempCommittedSaving = [];
  committedSaving = new CommittedRepayment()
  userDetails: any = {}
  msgs = [];
  clientId;
  liabilityId;
  committedSavingId;
  loadingOnSubmit = false;
  addUpdateCommittedRepaymentButtonText = 'Add';
  liability = new Liability()
  isErrorOccured = false
  isAmountChanged = false
  committedSavingArray
  committedSavingFrequencyTypes = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
  committedSavingType = CommittedSavingType;
  committedTranslations = CommittedRepaymentTranslations
  tooltipTranslations = TooltipTranslations;

  committedSavingDepositForm = new FormGroup({
    committedSavingTypeControl: new FormControl(null),
    depositNameControl: new FormControl(null),
    depositAmountControl: new FormControl(null),
    incrementalRateControl: new FormControl(null),
    excludeCashFlowControl: new FormControl(null),
    frequencyPeriodControl: new FormControl(null),
    absoluteAmountControl: new FormControl(null),
    outstandingAmountAfterLumpsumRepaymentControl: new FormControl(null),
    interestPayableAfterLumpsumRepaymentControl: new FormControl(null),
    savingsAfterLumpsumRepaymentControl: new FormControl(null),
    mutualFundRORControl: new FormControl(null),
    mutualFundFutureValueControl: new FormControl(null),
    mutualFundNetGainControl: new FormControl(null)

  });


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private changeDetector: ChangeDetectorRef,
    public keychainService: KeychainService,
    private financeService: FinanceService,
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadData()

  }

  async loadData() {

    try {

      this.clientId = this.route.snapshot.params['clientId'];
      this.liabilityId = this.route.snapshot.params['liabilityId'];
      this.committedSavingId = this.route.snapshot.params['committedId'];
      this.committedSaving.kind = String(CommittedSavingType.LupsumDeposit)
      this.committedSaving.excludeFromCashFlow = false;
      this.committedSaving.incrementalRate = 0
      this.addUpdateCommittedRepaymentButtonText = 'Add';

      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.navbar.subTitle = this.userDetails.name.fullName()

      this.navbar.routeBackTitle = 'Liability Information';
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/liability/${this.liabilityId}`;
      this.navbar.title = 'Committed Repayment';
      this.committedSavingArray = CommittedSavingTypeUtils.getCommittedSavingType(false);

      await this.getLiability()
      this.changeDetector.detectChanges()
      this.committedSaving.frequency = CommittedSavingFrequencyType.Yearly
      this.isErrorOccured = false
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

  changeDate() {

    if (this.regularStartDatePicker.eventDate.date) {
      this.regularEndDatePicker.minDate = this.regularStartDatePicker.eventDate.date
    }
    if (this.regularEndDatePicker.eventDate.date && this.regularStartDatePicker.eventDate.date && this.regularEndDatePicker.eventDate.date > this.regularStartDatePicker.eventDate.date) {
      this.regularEndDatePicker.eventDate.date = this.regularStartDatePicker.eventDate.date
    }

    if (this.regularEndDatePicker && this.regularEndDatePicker.eventDate && this.regularEndDatePicker.eventDate.date && this.regularEndDatePicker.eventDate.date < this.regularStartDatePicker.eventDate.date) {
      this.regularEndDatePicker.eventDate.date = this.regularStartDatePicker.eventDate.date
    }
  }

  async getLiability() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
      const parser = new JsonConvert()
      this.liability = parser.deserialize(response.liability, Liability);
      this.navbar.subTitle = this.liability.name + ' of ' + this.userDetails.name.fullName();

      if (this.committedSavingId) {
        this.committedSaving = this.liability.committedRepayments.find(committedRepayment => committedRepayment._id == this.committedSavingId)
        this.addUpdateCommittedRepaymentButtonText = 'Update';
      } else {
        this.committedSaving.name = this.liability.name
      }
    } catch (error) {
      throw error
    }
  }


  async didClickAddCommittedSaving() {

    if (this.isAmountChanged) {
      this.isAmountChanged = false
      alert("Please note: Loan OS as on date to be updated in Current loan Stage Section")
    }

    let validationSucceded = true;

    if (this.committedSaving && !this.committedSaving.amount) {
      this.committedSavingDepositForm.controls['depositAmountControl'].setErrors({ 'required': true });
      this.committedSavingDepositForm.controls['depositAmountControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.keychainService.isLoggedInAsAdmin() && this.committedSaving && this.committedSaving.kind && this.committedSaving.kind == String(CommittedSavingType.LupsumDeposit)) {
      if (this.committedSaving && !this.committedSaving.outstandingAmountAfterPayment) {
        this.committedSavingDepositForm.controls['outstandingAmountAfterLumpsumRepaymentControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['outstandingAmountAfterLumpsumRepaymentControl'].markAsTouched();
        validationSucceded = false;
      }
      if (this.committedSaving && !this.committedSaving.interestPayableAfterPayment) {
        this.committedSavingDepositForm.controls['interestPayableAfterLumpsumRepaymentControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['interestPayableAfterLumpsumRepaymentControl'].markAsTouched();
        validationSucceded = false;
      }
      if (this.committedSaving && !this.committedSaving.savingsAfterRepayment) {
        this.committedSavingDepositForm.controls['savingsAfterLumpsumRepaymentControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['savingsAfterLumpsumRepaymentControl'].markAsTouched();
        validationSucceded = false;
      }
      if (this.committedSaving && !this.committedSaving.mutualFundROR) {
        this.committedSavingDepositForm.controls['mutualFundRORControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['mutualFundRORControl'].markAsTouched();
        validationSucceded = false;
      }
      if (this.committedSaving && this.committedSaving.mutualFundFutureValue == null) {
        this.committedSavingDepositForm.controls['mutualFundFutureValueControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['mutualFundFutureValueControl'].markAsTouched();
        validationSucceded = false;
      }
      if (this.committedSaving && this.committedSaving.mutualFundNetGain == null) {
        this.committedSavingDepositForm.controls['mutualFundNetGainControl'].setErrors({ 'required': true });
        this.committedSavingDepositForm.controls['mutualFundNetGainControl'].markAsTouched();
        validationSucceded = false;
      }

    }
    this.committedSaving.kind == String(CommittedSavingType.LupsumDeposit)



    if (this.committedSaving && this.committedSaving.kind && this.committedSaving.kind == String(CommittedSavingType.LupsumDeposit)) {
      if (this.lumpsumStartDatePicker.validate() == false) {
        validationSucceded = false;
      } else {
        this.committedSaving.startDate = this.lumpsumStartDatePicker.valueToSend();
        this.committedSaving.endDate = undefined;
        this.committedSaving.frequency = undefined
      }

    } else {

      if (this.regularStartDatePicker.validate() == false) {
        validationSucceded = false;
      } else {
        this.committedSaving.startDate = this.regularStartDatePicker.valueToSend();
      }

      if (this.regularEndDatePicker.validate() == false) {
        validationSucceded = false;
      } else {
        this.committedSaving.endDate = this.regularEndDatePicker.valueToSend();
      }

      if (!this.regularStartDatePicker.verifyEndDate(this.regularStartDatePicker.eventDate, this.regularEndDatePicker.eventDate)) {

        this.loadingOnSubmit = false;
        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'End Date must be greater than Start Date.' }];
        validationSucceded = false
      }

      this.committedSaving.outstandingAmountAfterPayment = undefined
      this.committedSaving.interestPayableAfterPayment = undefined
      this.committedSaving.savingsAfterRepayment = undefined
      this.committedSaving.mutualFundFutureValue = undefined
      this.committedSaving.mutualFundNetGain = undefined

    }


    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.committedSavingId) {
        url = 'client/' + this.clientId + '/liability/' + this.liabilityId + '/committedRepayment/' + this.committedSavingId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/liability/' + this.liabilityId + '/committedRepayment';
        method = RequestMethod.Post;
      }

      try {
        const response = await this.httpService.request(method, url, this.committedSaving);
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



  didEndEditingAmount() {
    if (this.committedSaving.kind == String(CommittedSavingType.LupsumDeposit)) {
      this.isAmountChanged = true
    }
  }

  autoCalculateAbsoluteAmount() {


    if (this.committedSaving.amount != null && this.committedSaving.incrementalRate != null) {
      let amount = 0
      if (this.committedSaving.frequency != null) {

        if (this.committedSaving.frequency == CommittedSavingFrequencyType.Yearly) {
          amount = this.committedSaving.amount
        } else if (this.committedSaving.frequency == CommittedSavingFrequencyType.Monthly) {
          amount = this.committedSaving.amount * 12
        } else if (this.committedSaving.frequency == CommittedSavingFrequencyType.Quarterly) {
          amount = this.committedSaving.amount * 4
        } else if (this.committedSaving.frequency == CommittedSavingFrequencyType.HalfYearly) {
          amount = this.committedSaving.amount * 2
        }

      } else {
        amount = this.committedSaving.amount
      }
      let absoluteAmount = amount * (this.committedSaving.incrementalRate / 100)
      this.committedSaving.absoluteAmount = absoluteAmount
    }

    this.autoCalculate()
  }

  autoCalculateIncrementalRateOfContribution() {
    if (this.committedSaving.amount != null && this.committedSaving.absoluteAmount != null) {
      let IncremntalROC = this.committedSaving.amount / 100
      let IROC = this.committedSaving.absoluteAmount / IncremntalROC
      this.committedSaving.incrementalRate = IROC
    }
  }

  didClickCancelButton() {
    this.navbar.routeBack()
  }


  autoCalculate() {

    let projectedDate = this.lumpsumStartDatePicker.eventDate.projectedStartDate(this.userDetails)

    if (this.liability.currentStage.date != undefined && projectedDate != undefined) {

      let numberOfEmisTillPaymentDate = Math.floor(new DateDiff(projectedDate, this.liability.currentStage.date).months())

      if (numberOfEmisTillPaymentDate >= 0) {


        let outStandingAmountBeforePayment = this.liability.currentStage.outStandingAmount

        if (numberOfEmisTillPaymentDate > 0) {

          let interestPayableTillPayment = this.financeService.CUMIPMT(this.liability.rateOfInterest, this.liability.currentStage.numberOfRepaymentsPayable, this.liability.currentStage.outStandingAmount, 1, numberOfEmisTillPaymentDate);
          let totalAmountPaid = this.liability.currentStage.emiPaid * numberOfEmisTillPaymentDate
          let principalPaidTillPayment = totalAmountPaid + interestPayableTillPayment
          outStandingAmountBeforePayment = outStandingAmountBeforePayment - principalPaidTillPayment

        }

        let revisedTenure = this.financeService.NPER(this.liability.rateOfInterest, this.liability.currentStage.emiPaid, outStandingAmountBeforePayment)
        let interestPayableBeforePayment = this.financeService.CUMIPMT(this.liability.rateOfInterest, revisedTenure, outStandingAmountBeforePayment, 1, revisedTenure)

        this.committedSaving.outstandingAmountAfterPayment = outStandingAmountBeforePayment - this.committedSaving.amount

        let revisedTenureAfterPayment = this.financeService.NPER(this.liability.rateOfInterest, this.liability.currentStage.emiPaid, this.committedSaving.outstandingAmountAfterPayment)
        this.committedSaving.interestPayableAfterPayment = this.financeService.CUMIPMT(this.liability.rateOfInterest, revisedTenureAfterPayment, this.committedSaving.outstandingAmountAfterPayment, 1, revisedTenureAfterPayment)
        this.committedSaving.savingsAfterRepayment = - this.committedSaving.interestPayableAfterPayment + interestPayableBeforePayment
        this.committedSaving.mutualFundFutureValue = this.financeService.FV(this.committedSaving.mutualFundROR, revisedTenureAfterPayment, 0, this.committedSaving.amount, 1)
        this.committedSaving.mutualFundNetGain = - this.committedSaving.savingsAfterRepayment - this.committedSaving.mutualFundFutureValue

      } else {
        if (!isNaN(numberOfEmisTillPaymentDate)) {
          this.msgs = []
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Please enter current date or future date' }];
        }
      }

    }


  }

  didChangeMutualFundROR() {
    this.autoCalculate()
  }

  async ngAfterViewInit() {

    this.lumpsumStartDatePickers.changes.subscribe((pickers: QueryList<DatePickerComponent>) => {

      if (pickers.first) {
        this.lumpsumStartDatePicker = pickers.first
        if (!this.lumpsumStartDatePicker.client) {
          this.lumpsumStartDatePicker.client = this.userDetails
          this.lumpsumStartDatePicker.configure(this.committedSaving.startDate)
        }
      }

    });

    this.regularStartDatePickers.changes.subscribe((pickers: QueryList<DatePickerComponent>) => {

      if (pickers.first) {
        this.regularStartDatePicker = pickers.first
        if (!this.regularStartDatePicker.client) {
          this.regularStartDatePicker.client = this.userDetails
          this.regularStartDatePicker.configure(this.committedSaving.startDate)
        }
      }

    });

    this.regularEndDatePickers.changes.subscribe((pickers: QueryList<DatePickerComponent>) => {

      if (pickers.first) {
        this.regularEndDatePicker = pickers.first
        if (!this.regularEndDatePicker.client) {
          this.regularEndDatePicker.client = this.userDetails
          this.regularEndDatePicker.minDate = this.regularStartDatePicker.eventDate.date
          this.regularEndDatePicker.configure(this.committedSaving.endDate)
        }
      }

    });

  }

}
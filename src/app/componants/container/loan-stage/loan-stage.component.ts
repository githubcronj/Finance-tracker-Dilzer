import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Client } from '../../../model/client';
import { Liability } from '../../../model/liability/liability'
import { LoanStage } from '../../../model/liability/loanStage/loanStage'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { LiabilityType, LiabilityTypeUtils } from '../../../model/enum/liability-type.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { FinanceService } from '../../../services/finance.service';
import { ResourcesService } from '../../../services/resources.service';
import { LoanStageTranslations } from './loan-stage.translations';
import { MessageService } from '../../../services/message.service';



@Component({
  selector: 'app-loan-stage',
  templateUrl: './loan-stage.component.html',
  styleUrls: ['./loan-stage.component.css']
})
export class LoanStageComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  addLoanStageButtonText = 'Add';
  loadingOnSubmit = false;
  clientId;
  liabilityId;
  loanStageId;
  msgs = [];
  isErrorOccured = false
  liability = new Liability()
  userDetails: any = {}


  translations = LoanStageTranslations
  isLoanOutstandingAlertDisplayed = false

  loanStageForm = new FormGroup({
    dateControl: new FormControl(null, [Validators.required]),
    outStandingAmountControl: new FormControl(null, [Validators.required]),
    emiPaidControl: new FormControl(null, [Validators.required]),
    repaymentsPaidControl: new FormControl(null, [Validators.required]),
    repaymentsPayableControl: new FormControl(null, [Validators.required]),
    remainingInterestPayableControl: new FormControl(null, [Validators.required]),
    remainingPrincipalPayableControl: new FormControl(null, [Validators.required])
  });

  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private changeDetector: ChangeDetectorRef,
    private finance: FinanceService,
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

      this.navbar.title = ' Current Loan Stage';
      this.navbar.isBorderEnabled = true;
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/liability/${this.liabilityId}`;
      this.navbar.routeBackTitle = 'Liability Information';

      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      await this.getLiability()

      if (this.liabilityId) {
        await this.getLoanStageDetails();
      }
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

  async getLiability() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
      const parser = new JsonConvert()
      this.liability = parser.deserialize(response.liability, Liability);
      this.navbar.subTitle = this.liability.name + ' of ' + this.userDetails.name.fullName();

    } catch (error) {
      throw error
    }
  }

  async getLoanStageDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/liability/' + this.liabilityId, null);
      const parser = new JsonConvert()
      let liability = parser.deserialize(response.liability, Liability);
      this.navbar.routeBackTitle = liability.name;
      if (liability.currentStage == undefined) {
        liability.loanStage = new LoanStage()
      }
      if (this.liability.currentStage.date == undefined) {
        this.liability.currentStage.date = new Date()
      }
    } catch (error) {
      throw error
    }

  }


  async didClickAddLoanStage() {
    let validationSucceded = true;

    if (this.liability.currentStage && this.liability.currentStage.numberOfRepaymentsPaid == null) {
      this.loanStageForm.controls['repaymentsPaidControl'].setErrors({ 'required': true });
      this.loanStageForm.controls['repaymentsPaidControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability.currentStage && this.liability.currentStage.numberOfRepaymentsPayable == null) {
      this.loanStageForm.controls['repaymentsPayableControl'].setErrors({ 'required': true });
      this.loanStageForm.controls['repaymentsPayableControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability.currentStage && this.liability.currentStage.remainingInterestPayable == null) {
      this.loanStageForm.controls['remainingInterestPayableControl'].setErrors({ 'required': true });
      this.loanStageForm.controls['remainingInterestPayableControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.liability.currentStage && this.liability.currentStage.remainingPrincipalPayable == null) {
      this.loanStageForm.controls['remainingPrincipalPayableControl'].setErrors({ 'required': true });
      this.loanStageForm.controls['remainingPrincipalPayableControl'].markAsTouched();
      validationSucceded = false;
    }


    if (validationSucceded) {

      try {
        const response = await this.httpService.request(RequestMethod.Put, 'client/' + this.clientId + '/liability/' + this.liabilityId + '/current-stage', this.liability.currentStage);
        this.routeBack()
        this.loadingOnSubmit = false;
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

  didClickLoanOutstandingField() {
    this.autoCalculateTotalLoanDue()
    if (!this.isLoanOutstandingAlertDisplayed) {
      this.isLoanOutstandingAlertDisplayed = true
      this.msgs = [{ severity: 'info', summary: 'Info Message', detail: 'Current loan outstanding amount should be updated, whenevr lump sum prepayment is done.' }];
    }
  }

  didClickRemainingInterestPayableField() {
    this.autoCalculateTotalLoanDue()
  }

  autoCalculateTotalLoanDue() {

    this.liability.calculateStageAndRepayment(this.finance)

  }

  routeBack() {
    this.navbar.routeBack()
  }
}

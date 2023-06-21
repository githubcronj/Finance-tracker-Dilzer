import { Component, OnInit, ViewChild, ViewChildren, ChangeDetectorRef, AfterViewInit, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpService } from '../../../services/http.service';
import { RequestMethod } from '@angular/http';
import { CommittedSaving } from '../../../model/CommittedSaving';
import { Asset } from '../../../model/asset/asset';
import { Client } from '../../../model/client';
import { CommittedSavingType, CommittedSavingTypeUtils } from '../../../model/enum/asset/committed-saving.enum';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { KeychainService } from '../../../services/keychain.service';
import { CommittedSavingFrequencyType, CommittedSavingFrequencyTypeUtils } from '../../../model/enum/asset/committed-saving-frequency.enum'
import { CommittedSavingTranslations } from './committed-saving.translations';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { DatePickerModule } from '../date-picker/date-picker.module'
import { DatePickerComponent } from '../date-picker/date-picker.component'
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-committed-saving',
  templateUrl: './committed-saving.component.html',
  styleUrls: ['./committed-saving.component.css']
})

export class CommittedSavingComponent implements OnInit, AfterViewInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  @ViewChildren('lumpsumStartDatePicker') lumpsumStartDatePickers: QueryList<DatePickerComponent>;
  @ViewChildren('regularStartDatePicker') regularStartDatePickers: QueryList<DatePickerComponent>;
  @ViewChildren('regularEndDatePicker') regularEndDatePickers: QueryList<DatePickerComponent>;
  lumpsumStartDatePicker: DatePickerComponent;
  regularStartDatePicker: DatePickerComponent;
  regularEndDatePicker: DatePickerComponent;


  tempCommittedSaving = [];
  committedSaving: any = {}
  userDetails: any = {}
  nameOfTheAsset: any;
  msgs = [];
  clientId;
  assetId;
  committedSavingId;
  loadingOnSubmit = false;
  addUpdateCommittedSavingsButtonText = 'Add';
  committedTranslations;
  tooltipTranslations = TooltipTranslations;
  committedSavingArray
  committedSavingFrequencyTypes = CommittedSavingFrequencyTypeUtils.getAllCommittedSavingFrequencyType();
  committedSavingType = CommittedSavingType;

  isErrorOccured = false

  committedSavingDepositForm = new FormGroup({
    committedSavingTypeControl: new FormControl(null),
    depositNameControl: new FormControl(null),
    depositAmountControl: new FormControl(null),
    incrementalRateControl: new FormControl(null),
    excludeCashFlowControl: new FormControl(null),
    frequencyPeriodControl: new FormControl(null),
    absoluteAmountControl: new FormControl(null)

  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private changeDetector: ChangeDetectorRef,
    public keychainService: KeychainService,
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadData()

  }

  async loadData() {


    try {
      
      this.clientId = this.route.snapshot.params['clientId'];
      this.assetId = this.route.snapshot.params['assetId'];
      this.committedSavingId = this.route.snapshot.params['committedId'];
      this.committedSaving.kind = CommittedSavingType.LupsumDeposit;
      this.committedSaving.excludeFromCashFlow = false;
      this.committedSaving.incrementalRate = 0
      this.committedTranslations = CommittedSavingTranslations
      this.addUpdateCommittedSavingsButtonText = 'Add';

      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.navbar.subTitle = this.userDetails.name.fullName()
      this.navbar.routeBackTitle = 'Asset Information';
      this.navbar.routeBackPath = `/auth/client/${this.clientId}/asset/${this.assetId}`;
      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Committed Saving';
      this.committedSavingArray = CommittedSavingTypeUtils.getCommittedSavingType(true);
      this.committedSaving.frequency = CommittedSavingFrequencyType.Yearly
      await this.getAsset()
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

  retry() {
    this.loadData()
  }

  async getAsset() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/asset/' + this.assetId, null);
      const parser = new JsonConvert()
      let asset: Asset = parser.deserialize(response.asset, Asset);
      this.nameOfTheAsset = asset.name
      this.navbar.subTitle = asset.name + ' of ' + this.userDetails.name.fullName();

      if (this.committedSavingId) {
        this.addUpdateCommittedSavingsButtonText = 'Update';
        this.committedSaving = asset.committedSavings.find(committedSaving => committedSaving._id == this.committedSavingId)
      } else {
        this.committedSaving.name = asset.name
      }

    } catch (error) {
      throw error
    }
  }


  async didClickAddCommittedSaving() {

    let validationSucceded = true;

    if (this.committedSaving && !this.committedSaving.amount) {
      this.committedSavingDepositForm.controls['depositAmountControl'].setErrors({ 'required': true });
      this.committedSavingDepositForm.controls['depositAmountControl'].markAsTouched();
      validationSucceded = false;
    }

    this.committedSaving.kind == CommittedSavingType.LupsumDeposit

    if (this.committedSaving && this.committedSaving.kind && this.committedSaving.kind == CommittedSavingType.LupsumDeposit) {

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

    }

    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;

      if (this.assetId) {
        if (this.committedSavingId) {
          url = 'client/' + this.clientId + '/asset/' + this.assetId + '/committedSaving/' + this.committedSavingId;
          method = RequestMethod.Put;
        } else {
          url = 'client/' + this.clientId + '/asset/' + this.assetId + '/committedSaving';
          method = RequestMethod.Post;
        }
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
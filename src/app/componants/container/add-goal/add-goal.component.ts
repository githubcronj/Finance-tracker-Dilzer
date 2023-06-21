import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
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
import { GoalType, GoalTypeUtils } from '../../../model/enum/goal-type.enum';
import { Goal } from '../../../model/goal/goal'
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { DatePickerModule } from '../date-picker/date-picker.module'
import { DatePickerComponent } from '../date-picker/date-picker.component'
import { GoalTimeLine } from '../../../model/goal/goalTimeLine';
import { DatePickerType } from '../date-picker/date-picker.enum'
import { EventDate } from '../../../model/value-objects/eventDate';
import { AddGoalTranslations } from './add-goal.translations';
import { ResourcesService } from '../../../services/resources.service';
import { TooltipTranslations } from '../../../translations/tooltip.translations';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  @ViewChildren('startDatePicker') startDatePickers: QueryList<DatePickerComponent>;
  @ViewChildren('endDatePicker') endDatePickers: QueryList<DatePickerComponent>;

  startDatePicker: DatePickerComponent;
  endDatePicker: DatePickerComponent;
  translations = AddGoalTranslations
  blockHeader = 'Add Goal';
  addUpdateGoalButtonText = 'Add';
  goal: any = {};
  loadingOnSubmit = false;
  clientId;
  goalId;
  msgs = [];
  goalTypeList = GoalTypeUtils.getAllGoalType();
  showOtherFeild = false
  isErrorOccured = false
  userDetails: any = {}
  goalTimeLine = new GoalTimeLine()
  showDiv = false
  isGoalHAppenMoreThanYear = false
  goalFrequency = []
  eventDate = new EventDate()
  ownerOfGoalList = [];
  inflationList = []
  tooltipTranslations = TooltipTranslations;
  ownerName;

  goalDetailForm = new FormGroup({
    goalNameControl: new FormControl(null, [Validators.required]),
    goalTypeControl: new FormControl(null, [Validators.required]),
    currentValuationControl: new FormControl(null, [Validators.required]),
    inflationRateControl: new FormControl(null, [Validators.required]),
    otherGoalControl: new FormControl(null, [Validators.required]),
    categoryControl: new FormControl(null),
    goalFrequencyControl: new FormControl(null),
    goalOwnerControl: new FormControl(null),
    needInsuranceAnalysisControl: new FormControl(null)

  });


  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private changeDetector: ChangeDetectorRef,
    private keyChainService: KeychainService,
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }



  async ngOnInit() {
    this.loadData()
  }

  async loadData() {

    try {

      for (let i = 1; i <= 10; i++) {
        this.goalFrequency.push({ key: i, value: `Every ${Math.abs(i)} year` })
      }

      for (let i = 6; i <= 10; i++) {
        this.inflationList.push(i)
      }

      this.clientId = this.route.snapshot.params['clientId'];
      this.goalId = this.route.snapshot.params['goalId'];
      this.navbar.routeBackTitle = 'Goals';
      this.navbar.title = 'Add Goal';
      this.navbar.isBorderEnabled = true;

      if (this.keyChainService.isLoggedInAsAdmin()) {

        this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

      } else {
        this.navbar.routeBackPath = "/auth/home";

      }
      this.navbar.routeBackQueryParams = { selected: 4 };

      if (this.goal.kind == null) {
        this.goal.kind = String(GoalType.BusinessSetUp)
      }

      await this.getUserDetails();
      this.ownerName = this.ownerOfGoalList[0].key;
      this.goal.owners = this.ownerName
      this.goal.needInsuranceAnalysis = false;

      if (this.goalId) {
        await this.getGoalDetails();
        this.blockHeader = 'Edit Goal'
        this.navbar.routeBackTitle = 'Goal Information';
        this.navbar.title = 'Edit Goal';
        this.navbar.isBorderEnabled = true;
        this.addUpdateGoalButtonText = 'Update';
        this.goalDetailForm.get('goalTypeControl').disable()

        if (this.goal && this.goal.goalTimeLine && this.goal.goalTimeLine.endDate) {
          this.isGoalHAppenMoreThanYear = true
          this.showDiv = true
        } else {
          this.isGoalHAppenMoreThanYear = false
        }
        if (this.goal.goalTimeLine) {
          this.goalTimeLine = this.goal.goalTimeLine
        }
        if (this.goal.goalTimeLine.frequency == null) {
          this.goal.goalTimeLine.frequency = this.goalFrequency[0].key
        }
      }
      this.showOtherTypeField()

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
  async ngAfterViewInit() {

    this.endDatePickers.changes.subscribe((pickers: QueryList<DatePickerComponent>) => {

      if (pickers.first) {
        this.endDatePicker = pickers.first
        if (!this.endDatePicker.client) {
          this.endDatePicker.client = this.userDetails
          this.endDatePicker.minDate = this.startDatePicker.eventDate.date
          this.endDatePicker.configure(this.goalTimeLine.endDate)
        }
      }
    });


    this.startDatePickers.changes.subscribe((pickers: QueryList<DatePickerComponent>) => {

      if (pickers.first) {
        this.startDatePicker = pickers.first
        if (!this.startDatePicker.client) {
          this.startDatePicker.client = this.userDetails
          this.startDatePicker.minDate = new Date()
          this.startDatePicker.configure(this.goalTimeLine.startDate)
        }
      }
    });

  }
  async getUserDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.navbar.subTitle = this.userDetails.name.fullName();
      this.ownerOfGoalList = this.userDetails.ownerOfResourceList();
    } catch (error) {
      throw error
    }
  }

  async getGoalDetails() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/goal/' + this.goalId, null);
      const parser = new JsonConvert()
      this.goal = parser.deserialize(response.goal, Goal);

      if (this.goal.owners.length > 1) {
        this.ownerName = this.goal.owners[0] + '&' + this.goal.owners[1]
      } else {
        this.ownerName = this.goal.owners[0]
      }
    } catch (error) {
      throw error
    }
  }


  didChangeOwner(event) {
    this.goal.owners = event.target.value.split('&');
  }

  changeDate() {

    if (this.startDatePicker.eventDate.date) {

      if (this.endDatePicker) {
        this.endDatePicker.minDate = this.startDatePicker.eventDate.date
      }
    }

    if (this.endDatePicker && this.endDatePicker.eventDate.date && this.startDatePicker.eventDate.date && this.endDatePicker.eventDate.date > this.startDatePicker.eventDate.date) {
      this.endDatePicker.eventDate.date = this.startDatePicker.eventDate.date
    }

    if (this.endDatePicker && this.endDatePicker.eventDate.date && this.endDatePicker.eventDate.date < this.startDatePicker.eventDate.date) {
      this.endDatePicker.eventDate.date = this.startDatePicker.eventDate.date
    }
  }

  async didChangeGoalType() {

    if (this.goal.kind == GoalType.RetirementGoal) {

      this.isGoalHAppenMoreThanYear = true
      this.showDiv = true
      this.changeDetector.detectChanges()
      if (this.startDatePicker.eventDate) {
        this.startDatePicker.eventDate.type = DatePickerType.ByRetirementAge
      }
      if (this.endDatePicker.eventDate) {
        this.endDatePicker.eventDate.type = DatePickerType.ByLifeExpectency
      }
      if (this.goal && this.goalTimeLine) {
        this.goalTimeLine.frequency = this.goalFrequency[0].key
      }
      try {
        const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/total-early-retirement-expense', null);
        if (response.amount != null) {
          this.goal.currentValuation = response.amount
        }
      } catch (error) {
        throw error
      }
    } else {

      this.isGoalHAppenMoreThanYear = false
      this.showDiv = false
      this.changeDetector.detectChanges()
      if (this.startDatePicker.eventDate) {
        this.startDatePicker.eventDate.type = DatePickerType.ByDate
        this.goal.currentValuation = 0
      }
    }
    this.showOtherTypeField()
  }

  async createBasicGoal() {
    let validationSucceded = true;

    if (this.goal && this.goal.name == null) {
      this.goalDetailForm.controls['goalNameControl'].setErrors({ 'required': true });
      this.goalDetailForm.controls['goalNameControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.goal && this.goal.currentValuation == null) {
      this.goalDetailForm.controls['currentValuationControl'].setErrors({ 'required': true });
      this.goalDetailForm.controls['currentValuationControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.goal && this.goal.kind == null) {
      this.goalDetailForm.controls['goalTypeControl'].setErrors({ 'required': true });
      this.goalDetailForm.controls['goalTypeControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.goal && this.goal.inflationRate == null) {
      this.goalDetailForm.controls['inflationRateControl'].setErrors({ 'required': true });
      this.goalDetailForm.controls['inflationRateControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.showDiv && this.endDatePicker) {
      if (this.endDatePicker.validate() == false) {
        return
      }
    }
    if (this.startDatePicker.validate() == false) {
      return
    }
    this.goalTimeLine.startDate = this.startDatePicker.valueToSend();

    if (!this.showDiv) {
      this.goalTimeLine.endDate = undefined
      this.goalTimeLine.frequency = undefined
    } else {
      this.goalTimeLine.endDate = this.endDatePicker.valueToSend();
      this.goalTimeLine.frequency = this.goalTimeLine.frequency

      if (!this.startDatePicker.verifyEndDate(this.startDatePicker.eventDate, this.endDatePicker.eventDate)) {

        this.loadingOnSubmit = false;
        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'End Date must be greater than Start Date.' }];
        validationSucceded = false
      }
    }

    this.goal.goalTimeLine = this.goalTimeLine

    if (validationSucceded) {
      this.loadingOnSubmit = true;
      let url = '';
      let method;
      if (this.goalId) {
        url = 'client/' + this.clientId + '/goal/' + this.goalId;
        method = RequestMethod.Put;
      } else {
        url = 'client/' + this.clientId + '/goal';
        method = RequestMethod.Post;
      }


      try {
        const response = await this.httpService.request(method, url, this.goal);
        this.router.navigate(['/auth/client/' + this.clientId + '/goal/' + response.goal._id]);
        this.location.replaceState('/auth/client/' + this.clientId + '/goal/' + response.goal._id);
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

  showOtherTypeField() {
    if (this.goal.kind == GoalType.Other) {
      this.showOtherFeild = true;
    } else {
      this.showOtherFeild = false;
    }
  }

  routeBack() {
    this.navbar.routeBack()
  }

  changeCategory() {

    if (this.isGoalHAppenMoreThanYear == true) {
      this.showDiv = true
      this.changeDetector.detectChanges()
      if (this.startDatePicker.eventDate.date) {
        this.endDatePicker.minDate = this.startDatePicker.eventDate.date
      }
      this.goalTimeLine.frequency = this.goalFrequency[0].key
    } else {
      this.showDiv = false
    }
  }
}

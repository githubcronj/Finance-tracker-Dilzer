import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePickerType } from './date-picker.enum'
import { Client } from '../../../model/client';
import { EventDate } from '../../../model/value-objects/eventDate';
import { Liability } from '../../../model/liability/liability';



@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() datePickerEmitter = new EventEmitter<any>();

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  client: Client
  eventDate = undefined
  @Input() isCommittedRepaymentEndDate = false

  minDate: Date
  ageList = []
  clientAndSpouse = []
  allMembers = []
  retirementList = []
  expiryList = []

  datePickerFormGroup = new FormGroup({
    dateControl: new FormControl(null),
    typeControl: new FormControl(null),
    ageMemberControl: new FormControl(null),
    ageControl: new FormControl(null),
    retirementMemberControl: new FormControl(null),
    retirementControl: new FormControl(null),
    expiryMemberControl: new FormControl(null),
    expiryControl: new FormControl(null),
  });


  ngOnInit() {

    for (let i = 1; i <= 100; i++) {
      this.ageList.push(i)
    }


    for (let i = -10; i <= 10; i++) {
      let yearsString = 'years'
      if (i == -1 || i == 1) {
        yearsString = 'year'
      }
      if (i == 0) {
        this.retirementList.push({ key: i, value: "retirement age" })
      } else if (i < 0) {
        this.retirementList.push({ key: i, value: `${Math.abs(i)} ${yearsString} before retirement` })
      }
      else {
        this.retirementList.push({ key: i, value: `${Math.abs(i)} ${yearsString} after retirement` })
      }
    }

    for (let i = -5; i <= 5; i++) {
      let yearsString = 'years'
      if (i == -1 || i == 1) {
        yearsString = 'year'
      }
      if (i == 0) {
        this.expiryList.push({ key: i, value: "life expectency" })
      } else if (i < 0) {
        this.expiryList.push({ key: i, value: `${Math.abs(i)} ${yearsString} before expiry` })
      }
      else {
        this.expiryList.push({ key: i, value: `${Math.abs(i)} ${yearsString} after expiry` })
      }
    }


  }

  setMaxDate() {
    this.changeDate()
  }
  changeDate() {
    this.datePickerEmitter.emit(null)
  }

  valueToSend() {

    let eventDate = new EventDate()
    eventDate.type = this.eventDate.type
    if (this.eventDate.type == DatePickerType.ByDate) {

      eventDate.date = this.eventDate.date

    } else if (this.eventDate.type == DatePickerType.ByAge) {

      eventDate.age = this.eventDate.age
      eventDate.ageMember = this.eventDate.ageMember

    } else if (this.eventDate.type == DatePickerType.ByRetirementAge) {

      eventDate.retirementIndex = this.eventDate.retirementIndex
      eventDate.retirementMember = this.eventDate.retirementMember

    } else if (this.eventDate.type == DatePickerType.ByLifeExpectency) {

      eventDate.expiryMember = this.eventDate.expiryMember
      eventDate.expiryIndex = this.eventDate.expiryIndex

    }


    return eventDate

  }

  verifyEndDate(startEventDate, endEventDate) {
    let startdate;
    let endDate;

    if (startEventDate.type == DatePickerType.ByDate) {

      startdate = startEventDate.date.getFullYear()

    } else if (startEventDate.type == DatePickerType.ByAge) {

      let member = this.client.memberInfo(startEventDate.ageMember)
      startdate = member.dob.getFullYear() + Number(startEventDate.age)

    } else if (startEventDate.type == DatePickerType.ByRetirementAge) {

      startdate = Number(startEventDate.retirementIndex) + this.client.dob.getFullYear() + this.client.retirementAge

    } else if (startEventDate.type == DatePickerType.ByLifeExpectency) {

      startdate = Number(startEventDate.expiryIndex) + this.client.dob.getFullYear() + this.client.lifeExpectancy

    }

    if (endEventDate.type == DatePickerType.ByDate) {

      endDate = endEventDate.date.getFullYear()

    } else if (endEventDate.type == DatePickerType.ByAge) {

      let member = this.client.memberInfo(endEventDate.ageMember)
      endDate = member.dob.getFullYear() + endEventDate.age

    } else if (endEventDate.type == DatePickerType.ByRetirementAge) {

      endDate = Number(endEventDate.retirementIndex) + this.client.dob.getFullYear() + this.client.retirementAge

    } else if (endEventDate.type == DatePickerType.ByLifeExpectency) {
      endDate = Number(endEventDate.expiryIndex) + this.client.dob.getFullYear() + this.client.lifeExpectancy

    }
    if (startdate > endDate) {
      return false
    } else {
      return true
    }
  }

  validate() {
    let validationSucceded = true
    if (this.eventDate.type == DatePickerType.ByDate && this.eventDate && !this.eventDate.date) {
      this.datePickerFormGroup.controls['dateControl'].setErrors({ 'required': true });
      this.datePickerFormGroup.controls['dateControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      return true
    } else {
      return false
    }

  }

  configure(eventDate: EventDate) {
    this.clientAndSpouse = this.client.allMembers(false)
    this.allMembers = this.client.allMembers(true)

    this.eventDate = new EventDate()
    this.eventDate.type = DatePickerType.ByDate
    this.eventDate.age = 50
    this.eventDate.ageMember = this.client._id
    this.eventDate.retirementMember = this.client._id
    this.eventDate.retirementIndex = 0
    this.eventDate.expiryMember = this.client._id
    this.eventDate.expiryIndex = 0


    if (eventDate) {

      this.eventDate.type = eventDate.type

      if (this.eventDate.type == DatePickerType.ByDate) {
        this.eventDate.date = eventDate.date

      } else if (this.eventDate.type == DatePickerType.ByAge) {

        this.eventDate.age = eventDate.age
        this.eventDate.ageMember = eventDate.ageMember

      } else if (this.eventDate.type == DatePickerType.ByRetirementAge) {

        this.eventDate.retirementIndex = eventDate.retirementIndex
        this.eventDate.retirementMember = eventDate.retirementMember


      } else if (this.eventDate.type == DatePickerType.ByLifeExpectency) {

        this.eventDate.expiryMember = eventDate.expiryMember
        this.eventDate.expiryIndex = eventDate.expiryIndex

      }
    }

    this.changeDetector.detectChanges()

  }
}

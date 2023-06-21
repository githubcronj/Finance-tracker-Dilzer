import { Component, OnInit, Inject, forwardRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { HttpService } from '../../../services/http.service';
import { ResourcesService } from '../../../services/resources.service';
import { KeychainService } from '../../../services/keychain.service';
import { RequestMethod } from '@angular/http';
import { RelationshipType, RelationshipTypeUtils } from '../../../model/enum/relationship_type.enum';
import { NavbarComponent } from '../navbar/navbar.component';
import { Client } from '../../../model/client';
import { FamilyMembers } from '../../../model/family-members';
import { HealthHistoryTranslations } from './dependents.translations';
import { HealthHistory } from '../../../model/value-objects/healthHistory'
import { GeneralHealthConditonStatus, GeneralHealthConditonUtils } from '../../../model/enum/general-health-condition.enum';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.css']
})

export class DependentsComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  familyMember = new FamilyMembers()
  clientId = '';
  familyId = '';
  msgs = [];
  ageList = [];
  loadingOnSubmit = false;
  isErrorOccured = false

  generalHealthConditionTypes = GeneralHealthConditonUtils.getAllGeneralHealthConditonStatus();
  relationShipTypeOptions = RelationshipTypeUtils.getAllRelationshipTypes();
  healthHistoryTranslations = HealthHistoryTranslations;

  dependentForm = new FormGroup({
    nameControl: new FormControl(null, [Validators.required]),
    dobControl: new FormControl(null, [Validators.required]),
    relationControl: new FormControl(null, [Validators.required]),
    lifeExpectancyControl: new FormControl(null, [Validators.required]),
    generalHealthConditionControl: new FormControl(null),
    regularHealthCheckupControl: new FormControl(null),
    isHeathParamertersNormal: new FormControl(null),
    healthParameterOutOfRangeControl: new FormControl(null, [Validators.required]),
    isChronicHeathConditionNormal: new FormControl(null),
    chronicHealthConditionDurationControl: new FormControl(null, [Validators.required]),
    isChronicHeathConditionMedicated: new FormControl(null),
    otherHealthConcernControl: new FormControl(null)
  });
  maxDate: Date;
  hideShowHealthParameters = false
  hideShowChronicDuration = false


  constructor(
    private keyChainService: KeychainService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public resources: ResourcesService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService
  ) {

  }

  async ngOnInit() {
    this.loadData()

  }

  retry() {
    this.loadData()
  }

  async loadData() {

    try {
      for (let i = 1; i <= 100; i++) {
        this.ageList.push(i)
      }

      this.clientId = this.route.snapshot.parent.params['clientId'];
      this.familyId = this.route.snapshot.params['familyId'];
      this.navbar.routeBackTitle = 'Information';
      if (this.keyChainService.isLoggedInAsAdmin()) {

        this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

      } else {
        this.navbar.routeBackPath = "/auth/home";

      }
      this.navbar.routeBackQueryParams = { selected: 0 };

      this.navbar.isBorderEnabled = true;
      this.navbar.title = 'Family Member Information';
      let today = new Date();
      let month = today.getMonth();
      let year = today.getFullYear();
      this.maxDate = new Date();
      this.maxDate.setMonth(month);
      this.maxDate.setFullYear(year);

      this.messageService.sendMessage('show-loading');
      if (this.familyId) {
        await this.getFamilyMembers()
        this.showHideChronicDurationSection()
        this.showHideParametersSection()
      } else {
        if (this.familyMember && !this.familyMember.healthHistory.generalHealthCondition) {
          this.familyMember.healthHistory.generalHealthCondition = GeneralHealthConditonStatus.VeryGood;
        }
        if (this.familyMember && this.familyMember.relationship == null) {
          this.familyMember.relationship = RelationshipType.Spouse;
        }
        if (this.familyMember && this.familyMember.lifeExpectancy == null) {
          this.familyMember.lifeExpectancy = 80;
        }
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

  async getFamilyMembers() {
    try {
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/family-member/' + this.familyId, null);
      const parser = new JsonConvert()
      this.familyMember = parser.deserialize(response.member, FamilyMembers);
    } catch (error) {
      throw error
    }
  }

  async saveDependents(routeBack = true) {

    let validationSucceded = true;

    if (this.familyMember && !this.familyMember.name.firstName) {
      this.dependentForm.controls['nameControl'].setErrors({ 'required': true });
      this.dependentForm.controls['nameControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.familyMember && !this.familyMember.dob) {
      this.dependentForm.controls['dobControl'].setErrors({ 'required': true });
      this.dependentForm.controls['dobControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.familyMember && this.familyMember.relationship == null) {
      this.dependentForm.controls['relationControl'].setErrors({ 'required': true });
      this.dependentForm.controls['relationControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.familyMember && !this.familyMember.lifeExpectancy) {
      this.dependentForm.controls['lifeExpectancyControl'].setErrors({ 'required': true });
      this.dependentForm.controls['lifeExpectancyControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.hideShowHealthParameters && this.familyMember && this.familyMember.healthHistory.isHeathParamertersNormal == false && this.familyMember.healthHistory.parametersOutOfRange == null) {
      this.dependentForm.controls['healthParameterOutOfRangeControl'].setErrors({ 'required': true });
      this.dependentForm.controls['healthParameterOutOfRangeControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.hideShowChronicDuration && this.familyMember && this.familyMember.healthHistory.isChronicHeathConditionNormal == true && this.familyMember.healthHistory.chronicHeathConditionDuration == null) {
      this.dependentForm.controls['chronicHealthConditionDurationControl'].setErrors({ 'required': true });
      this.dependentForm.controls['chronicHealthConditionDurationControl'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {
      try {
        this.loadingOnSubmit = true;
        let url = '';
        let method;
        let family;

        if (this.familyMember && this.familyMember.name && this.familyMember.name.firstName.trim()) {
          family = this.familyMember;

          if (this.familyId) {
            url = 'client/' + this.clientId + '/family-member/' + this.familyId;
            method = RequestMethod.Put;
          } else {
            url = 'client/' + this.clientId + '/family-member';
            method = RequestMethod.Post;
          }

          try {

            const response = await this.httpService.request(method, url, family);
            this.loadingOnSubmit = false;
            this.routeBack()

          } catch (error) {

            this.loadingOnSubmit = false;
            if (error.message) {
              this.msgs = []
              this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
            } else {
              this.msgs = []
              this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
            }

          }
        } else {
          this.routeBack();
        }

      } catch (error) {
        this.loadingOnSubmit = false;
      }

    }
  }


  showHideParametersSection() {
    if (this.familyMember.healthHistory.isHeathParamertersNormal == true) {
      this.hideShowHealthParameters = false
    } else {
      this.hideShowHealthParameters = true
    }
  }

  showHideChronicDurationSection() {
    if (this.familyMember.healthHistory.isChronicHeathConditionNormal == true) {
      this.hideShowChronicDuration = true
    } else {
      this.hideShowChronicDuration = false
    }
  }


  routeBack() {
    this.navbar.routeBack()
  }

}

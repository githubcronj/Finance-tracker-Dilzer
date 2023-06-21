import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { ResourcesService } from '../../../../services/resources.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../../model/client';
import { RequestMethod } from '@angular/http';
import { Message } from 'primeng/primeng';
import { JsonConvert } from '../../../../model/parsers/json-convert';
import { ValidationService } from '../../../../services/validation.service';
import { ClientType, ClientTypeUtils } from '../../../../model/enum/client-type.enum';
import { Title, TitleUtils } from '../../../../model/enum/title.enum';
import { Gender, GenderUtils } from '../../../../model/enum/gender.enum';
import { ResidentialStatus, ResidentialStatusUtils } from '../../../../model/enum/residential_status.enum';
import { MaritalStatus, MaritalStatusUtils } from '../../../../model/enum/marital-status.enum';
import { informationTranslations } from './information.translation';
import { MessageService } from '../../../../services/message.service';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, OnDestroy {

  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  @Input('clientId') clientId: string;
  userDetails: any;
  errorMessage = '';
  msgs = [];
  isErrorOccured = true;
  maritalStatus = MaritalStatus
  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public resources: ResourcesService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    if (this.activatedRoute.snapshot.params['clientId']) {
        this.clientId = this.activatedRoute.snapshot.params['clientId'];
    }
    this.getClientInformation();
  }

  async getClientInformation() {
    try {
      this.messageService.sendMessage('show-loading');
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.isErrorOccured = false;
      this.messageService.sendMessage('hide-loading');
    } catch (error) {
      this.messageService.sendMessage('hide-loading');
      this.isErrorOccured = true;
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message;
    }
  }

  editRelation(memberId) {
    this.router.navigate(['/auth/client/' + this.clientId + '/family-member/' + memberId]);
  }

  async deleteRelation(memberId) {
    if (confirm('Are you sure you want to delete this family member?') == true) {
      try {
        const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/family-member/' + memberId, null);
        const parser = new JsonConvert()
        this.userDetails = parser.deserialize(response.client, Client);
        this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
      } catch (error) {

        if (error.message) {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
        } else {
          this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
        }
      }
    }
  }

  ngOnDestroy () {
    this.changeDetector.detach();
  }

}

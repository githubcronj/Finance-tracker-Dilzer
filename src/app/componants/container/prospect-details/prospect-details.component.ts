import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Stages } from '../../../model/enum/stages.enum';
import { Client } from '../../../model/client';
import { RequestMethod } from '@angular/http';
import { Message } from 'primeng/primeng';
import { NavbarComponent } from '../navbar/navbar.component';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { HearAboutUs } from '../../../model/enum/hear-about-us.enum'
import { FinancialAsset } from '../../../model/enum/financial-asset.enum'
import { MessageService } from '../../../services/message.service';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'


@Component({
  selector: 'app-client',
  templateUrl: './prospect-details.component.html',
  styleUrls: ['./prospect-details.component.css']
})
export class ProspectDetailsComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  userId = '';
  prospectErrorStatus = false;
  prospectSuccessStatus = false;
  prospectMessage;
  prospectDetail: any;
  prospectInitialInformation: Client;
  currentTab = 'basicinfo';
  clientStage: Number;
  msgs: Message[] = [];
  references = HearAboutUs;
  financialAssets = FinancialAsset
  isErrorOccured = false


  constructor(private plannermanagement: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private changeDetector : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.navbar.routeBackTitle = 'Clients';
    this.navbar.routeBackPath = "/auth/home";
    this.navbar.routeBackQueryParams = { selected: 0 };

    if (this.route.snapshot.params['clientId']) {
      this.userId = this.route.snapshot.params['clientId'];
    }
    this.prospectDetails(this.userId);

  }

  async prospectDetails(id) {

    try {

      this.messageService.sendMessage('show-loading');
      const response = await this.plannermanagement.request(RequestMethod.Get, 'client/' + this.userId, null);
      let userJsonObject = response.client;

      let parser = new JsonConvert()
      this.prospectDetail = parser.deserialize(userJsonObject, Client)

      this.navbar.title = this.prospectDetail.name.fullName()
      this.navbar.subTitle = this.prospectDetail.email;
      this.navbar.isBorderEnabled = true;
      this.prospectInitialInformation = this.prospectDetail.initialInformation;

      this.clientStage = this.prospectDetail.workFlowStage;
      this.prospectErrorStatus = false;
      this.messageService.sendMessage('hide-loading');

    } catch (error) {
      this.messageService.sendMessage('hide-loading');
      this.prospectErrorStatus = true;
      this.prospectSuccessStatus = false;
      this.isErrorOccured = true
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message
      this.errorHandling.buttonText = "Retry"
    }

  }

  retry() {
    this.prospectDetails(this.userId);
  }
  async resendInitialInfoLink() {
    try {
      const response = await this.plannermanagement.request(RequestMethod.Post, "/initial-info/resend-initial-info-link", { "email": this.prospectDetail.email });
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Succes', detail: response.message });

    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Succes', detail: error.message });
    }
  }

  async sendRegistrationFeeInvoice() {
    try {

      const response = await this.plannermanagement.request(RequestMethod.Put, 'client/stage', { 'clientId': this.userId, 'stage': Stages.ClientEngagmentAndInitialRegistrationFee });
      this.prospectErrorStatus = false;
      this.prospectSuccessStatus = true;
      this.prospectMessage = response.message;
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.prospectMessage });

    } catch (error) {
      this.prospectErrorStatus = true;
      this.prospectSuccessStatus = false;
      this.prospectMessage = error.message;
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: this.prospectMessage });

    }
  }

}

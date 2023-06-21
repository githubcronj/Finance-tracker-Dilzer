import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InformationComponent } from './information.component'
import { HttpService } from '../../../../services/http.service';
import { JsonConvert } from '../../../../model/parsers/json-convert';
import { RequestMethod } from '@angular/http';
import { Client } from '../../../../model/client';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component'
import { NetworthComponent } from './networth/networth.component';
import { CashflowComponent } from './cashflow/cashflow.component';
import { GoalsComponent } from './goals/goals.component';
import { RiskProfileQuestionsComponent } from './risk-profile-questions/risk-profile-questions.component';
import { CalculationsComponent } from './calculations/calculations.component';
import { MessageService } from '../../../../services/message.service';



@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})

export class ClientHomeComponent implements OnInit, OnDestroy {

  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  @ViewChild('navbar') navbar: NavbarComponent;

  shouldShowNavBar = false;
  selectedTab = 0;
  clientId;
  isErrorOccured = false
  userDetails;
  tabSelected = 0;
  riskProfileDisplayMessage = ' ';
  riskProfile
  eventListener


  constructor(private httpService: HttpService,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {

    this.eventListener = this.activatedRoute.queryParams.subscribe(params => {

      if (params['selected']) {
        this.selectedTab = params['selected'];
        this.tabSelected = params['selected'];
        this.changeDetector.detectChanges();
      } else {
        this.selectedTab = 0;
        this.tabSelected = 0;
        this.changeDetector.detectChanges();
      }
    })
  }

  async reloadForClientId(clientId) {
    this.clientId = clientId
    await this.loadData()
  }

  async loadData() {

    try {

      this.changeDetector.detectChanges();
      const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
      const parser = new JsonConvert()
      this.userDetails = parser.deserialize(response.client, Client);
      this.isErrorOccured = false;
      this.changeDetector.detectChanges();
      if (this.shouldShowNavBar == true && !this.isErrorOccured) {
        this.navbar.title = this.userDetails.name.fullName()
        this.navbar.subTitle = this.userDetails.email;
        this.navbar.routeBackTitle = 'Clients';
        this.navbar.routeBackPath = '/auth/home';
        this.navbar.routeBackQueryParams = { selected: 0 };
      }


      if (this.tabSelected) {
        this.tabChanged(this.tabSelected);
      }
    } catch (error) {
      this.isErrorOccured = true;
      this.messageService.sendMessage('hide-loading');
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message
    }

  }

  retry() {
    this.reloadForClientId(this.clientId)

  }

  async tabChanged(event) {
    if (event.index >= 0) {
      this.tabSelected = event.index;
    } else {
      this.tabSelected = Number(event);
    }
    this.changeDetector.detectChanges();
    this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: this.tabSelected, selectedSubIndex: 0 } });

  }

  ngOnDestroy() {
    this.changeDetector.detach();
    if (this.eventListener) {
      this.eventListener.unsubscribe();
    }
  }
}

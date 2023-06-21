import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { ErrorHandlingComponent } from '../../../../error-handling/error-handling.component'
import { GratuityCalculatorComponent } from './gratuity-calculator/gratuity-calculator.component';
import { EmergencyFundAnalysisComponent } from './emergency-fund-analysis/emergency-fund-analysis.component';
import { SidemenuComponent } from '../../../sidemenu/sidemenu.component';
import { Client } from '../../../../../model/client';
import { HttpService } from '../../../../../services/http.service';
import { KeychainService } from '../../../../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonConvert } from '../../../../../model/parsers/json-convert';
import { RequestMethod } from '@angular/http';
import { MessageService } from '../../../../../services/message.service';


@Component({
    selector: 'app-calculations',
    templateUrl: './calculations.component.html',
    styleUrls: ['./calculations.component.css']
})

export class CalculationsComponent implements OnInit, OnDestroy {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @ViewChild('sidemenu') sidemenu: SidemenuComponent;

    @Input('clientId') clientId: string;

    userDetails: Client;
    isErrorOccured = false;
    activeTab = 0;
    submenuList = ['Gratuity Calculator', 'Emergency Fund Calculator','Financial Ratio Analysis'];
    showDashboard = false;

    constructor(private httpService: HttpService,
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        private keychainService: KeychainService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
      
        if (this.activatedRoute.snapshot.params['clientId']) {
            this.clientId = this.activatedRoute.snapshot.params['clientId'];
        }
        this.sidemenu.setInitialData(this.submenuList);
        this.sidemenu.activeTab = this.activeTab;
        this.getCalculationInfo();
    }

    async getCalculationInfo() {

        try {
            this.messageService.sendMessage('show-loading');
            await this.getUserDetails()
            await this.checkUserInfo();
            this.messageService.sendMessage('hide-loading');
        } catch (error) {
            this.isErrorOccured = true;
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
        }
    }

    async getUserDetails() {

        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            const parser = new JsonConvert()
            this.userDetails = parser.deserialize(response.client, Client);
        } catch (error) {
            throw error
        }

    }

    async checkUserInfo() {
        if (this.userDetails.pan == undefined || this.userDetails.companyAddress.addressLine1 == undefined || this.userDetails.companyAddress.country == undefined || this.userDetails.companyAddress.city == undefined) {
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = 'Personal Information is not filled'
            this.errorHandling.buttonText = 'Click to fill Personal Information'
            this.showDashboard = false
        } else {
            this.showDashboard = true
        }
    }

    retry() {
        if (this.userDetails == undefined) {
            this.getCalculationInfo()
        } else if (this.userDetails.pan == undefined) {
            this.router.navigate(['/auth/client/' + this.clientId + '/personal-info']);
        } else if (this.userDetails.riskProfile.name == undefined) {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 1 } });
        }
    }

    async detectTabChange() {
        this.activeTab = this.sidemenu.activeTab;
        this.changeDetector.detectChanges();
        this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 5, selectedSubIndex: this.activeTab } });
    }

    
    ngOnDestroy() {
        this.changeDetector.detach();
    }

}

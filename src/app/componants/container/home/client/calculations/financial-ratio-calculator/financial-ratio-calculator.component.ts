import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ErrorHandlingComponent } from '../../../../../error-handling/error-handling.component';
import { MessageService } from '../../../../../../services/message.service';
import { ResourcesService } from '../../../../../../services/resources.service';
import { FinancialRatioCalculatorViewModel } from './financial-ratio-calculator-view-model';
import { BreakUpComponent } from './breakup-component/breakup-component.component';


@Component({
  selector: 'app-financial-ratio-calculator',
  templateUrl: './financial-ratio-calculator.component.html',
  styleUrls: ['./financial-ratio-calculator.component.css']
})

export class FinancialRatioCalculatorComponent implements OnInit {
  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
  @Input('clientId') clientId: string;
  isErrorOccured = false;

  constructor(private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private financialRatioCalculatorViewModel: FinancialRatioCalculatorViewModel,
    private messageService: MessageService,
    public resources: ResourcesService,
    private router: Router) { }

  ngOnInit() {
    this.financialRatioCalculatorViewModel.clientId = this.clientId;
    this.loadData();
  }

  async loadData() {
    try {
        this.messageService.sendMessage('show-loading');
        await this.financialRatioCalculatorViewModel.getFinancialDetails()
        this.isErrorOccured = false;
        this.messageService.sendMessage('hide-loading');
    } catch (error) {
        this.messageService.sendMessage('hide-loading');
        this.isErrorOccured = true;
        this.changeDetector.detectChanges();
        this.errorHandling.message = error.message;
        this.errorHandling.buttonText = "Retry";
    }
  }

  openDialog(component, width, height, breakup): void {
    let dialogRef = this.dialog.open(component, {
        width: width,
        height: height,
        data: breakup,
    });
}

  didOpenCashInHandBreakupDialog(breakup){
    this.openDialog(BreakUpComponent, '600px', '400px', breakup);
  }

  retry() {
    this.loadData();
  }

}

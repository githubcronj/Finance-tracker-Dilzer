import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod } from '@angular/http';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { paymentTranslations } from './payment.translations';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  token;
  translations = paymentTranslations;


  invoiceForm = new FormGroup({
    invoiceAmountControl: new FormControl(null, Validators.required),
    invoiceUserNameControl: new FormControl(null, Validators.required),
    invoiceUserEmailControl: new FormControl(null, Validators.required),
    invoiceUserPhoneControl: new FormControl(null, Validators.required),
    invoiceProductInfoControl: new FormControl(null, Validators.required),
    invoiceSuccessUrlControl: new FormControl(null, Validators.required),
    invoiceFailureUrlControl: new FormControl(null, Validators.required),
    invoiceKeyControl: new FormControl(null, Validators.required),
    invoiceTxnIdControl: new FormControl(null, Validators.required),
    invoiceHashControl: new FormControl(null, Validators.required),
    invoiceServiceProviderControl: new FormControl(null, Validators.required)
  });
  selectedService = "fp";
  invoiceData: any = {};

  constructor(private route: ActivatedRoute, public resources: ResourcesService,
    private messageService: MessageService,
    private usermanagement: HttpService) { }

  async ngOnInit() {
    if (this.route.snapshot.params['token']) {
      this.token = this.route.snapshot.params['token'];
    }
    try {

      const response = await this.usermanagement.request(RequestMethod.Post, "invoice/" + this.token, { "services": this.selectedService })
      this.invoiceData = response.params

    } catch (error) {

    }

  }

}

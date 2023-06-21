import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../../services/resources.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {


  constructor(
    public resources: ResourcesService,
    private messageService: MessageService
  ) { }
  
  ngOnInit() {
  }

}

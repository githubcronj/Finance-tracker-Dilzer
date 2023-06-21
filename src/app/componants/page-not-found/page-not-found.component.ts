import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public resources: ResourcesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

}

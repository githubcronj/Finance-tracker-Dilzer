import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  routeBackPath = undefined;
  routeBackQueryParams = undefined;  
  routeBackTitle = '';
  title: string;
  subTitle: string;
  isBorderEnabled = false;

  constructor(private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {

  }

  routeBack() {
    this.messageService.sendMessage('show-loading');
    if (this.routeBackPath) {

      this.router.navigate([this.routeBackPath],{ queryParams: this.routeBackQueryParams});
    } else {
      window.history.back()

    }

  }

}

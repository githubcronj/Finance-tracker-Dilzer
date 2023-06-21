import { Component, OnInit } from '@angular/core';
import { footerTranslations } from './footer.translation';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerTranslations = footerTranslations;

  constructor() { }

  ngOnInit() {
  }

}

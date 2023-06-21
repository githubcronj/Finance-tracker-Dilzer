import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.css']
  })
export class SidemenuComponent implements OnInit {
    activeTab: any;
    menuList = [];
    @Output() tabchange: EventEmitter<any> = new EventEmitter();

    constructor( ) { }

    ngOnInit() {}

    setInitialData(submenuList) {
        this.menuList = submenuList;
        this.activeTab = 0;
    }

    changeTabs(selectedtab) {
        this.activeTab = selectedtab;
        this.tabchange.emit(null);
    }
}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

  selectedTab = 0
  tabSelected = 0;
  eventListener;

  constructor(private activatedRoute: ActivatedRoute, private changeDetector: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
   this.eventListener =  this.activatedRoute.queryParams.subscribe(params => {

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

  async tabChanged(event) {
    if (event.index >= 0) {
      this.tabSelected = event.index;
    } else {
      this.tabSelected = Number(event);
    }
    this.router.navigate(['/auth/home'], { queryParams: { selected: this.tabSelected } });

  }

  ngOnDestroy() {
    this.changeDetector.detach();
    if (this.eventListener) {
      this.eventListener.unsubscribe();
    }

  }

}

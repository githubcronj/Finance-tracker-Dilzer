import { Component, HostListener, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MessageService } from './services/message.service';
import { LoadingComponent } from './componants/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('loading') loading: LoadingComponent;
  isVisibleScrollToTop = false;
  subscription;
  isLoading = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollIndex = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollIndex > 100) {
      this.isVisibleScrollToTop = true;
    } else {
      this.isVisibleScrollToTop = false;
    }
  }

  ngOnInit () {
    this.subscription = this.messageService.getMessage()
      .subscribe(response => {
          if (response && response.res && response.res == 'hide-loading') {
            this.isLoading = false;
            this.changeDetector.detectChanges();
          }
          if (response && response.res && response.res == 'show-loading') {
            this.isLoading = true;
            this.changeDetector.detectChanges();
          }
          if (response && response.res && response.res == 'show-loading-with-transparent') {
            this.isLoading = true;
            this.changeDetector.detectChanges();
            this.loading.transparent = true;
          }
      });
  }

  constructor (
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef
  ) {

  }

  goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}

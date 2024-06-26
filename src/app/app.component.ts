import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MetaService } from './services/meta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'metaDetective';

  isError = false;
  errorMessage: any = '';

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    @Inject('LOCALSTORAGE') private localStorage: any,
  private meta:MetaService) {

    console.log(this.meta.data);

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('error')) {
        this.isError = true;
        this.errorMessage = window.localStorage.getItem('error')?.toString();
      } else this.isError = false;
    }


  }

  goToHome() {
    window.location.assign(window.location.origin + '/')
  }
}

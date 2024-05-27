import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MetaService } from '../services/meta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  url: string = '';
  metaTags: any;
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  isSubmitted = false;

  @Input('url') set getUrl(link:string){
    if(link){
      this.url = link;
     this.formGroup.controls.url.setValue(link);
    }
  }

  

  formGroup = new FormGroup({
    url: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)])
  });


  constructor(private metaService: MetaService, private router : Router) { }


  onSearch(url?: any) {

    this.isSubmitted = true;

    if (url) this.formGroup.controls.url.setValue(url);

    if (this.formGroup.valid) {

      let splt = this.formGroup['controls'].url.value?.split('//') || [];
      let domain = splt[splt?.length - 1]

      let redirect = window.location.origin +'/'+ encodeURIComponent(domain);
      
      this.isSubmitted = false;
      // window.location.assign(redirect);

      this.router.navigate(['/'+ encodeURIComponent(domain)])
      console.log("redirected")
    }
  }


}

import { Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MetaService } from '../services/meta.service';
import { createPopper } from '@popperjs/core';
import { isPlatformBrowser } from '@angular/common';
import { AxiosService } from '../services/axios.service';
import { CheerioService } from '../services/cheerio.service';
import { next } from 'cheerio/lib/api/traversing';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  result: any = {
    "og:image": ''
  }

  url: any = '';
  allTags: any = {
    google: {},
    facebook: {},
    twitter: {}
  }

  isLoading = false


  constructor(private route: ActivatedRoute, private meta:MetaService, private axiosService: AxiosService, private cheerioService: CheerioService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject('LOCALSTORAGE') private localStorage: any) {

    this.route.paramMap.subscribe((params: ParamMap | any) => {
      this.url = 'https://' + decodeURIComponent(params.get('url'));

      if (this.url) {

        this.isLoading = true;
  
        this.meta.getDatas(this.url)
        .then((result:any) =>{
           this.result = result.metaTags;
           this.generateMetaTags();
           this.isLoading = false;
        }).catch(error =>{
          this.isLoading = false;
        });
      }
    });

  }

  getMetaTags(url: any) {
    this.axiosService.get(url)
      .then(response => {
        const $ = this.cheerioService.parseHTML(response.data);
        const metaTags: any = {};
        $('meta').each((i: any, elem: any) => {
          const name = $(elem).attr('name') || $(elem).attr('property');
          const content = $(elem).attr('content');
          if (name && content) {
            metaTags[name] = content;
          }
        });
  
        metaTags["title"] = $("title").text();

        console.log('Result', metaTags);
      })
      .catch(error => {
        console.error('Error', error);
      });
  }



  generateMetaTags() {
    console.log(this.allTags)

    Object.keys(this.result).forEach((key: string) => {
      console.log(key)


      switch (key.toLowerCase()) {
        case 'description':
          this.allTags['google'][key] = this.result[key];
          this.allTags[key] = this.result[key];
          break;
        case 'name':
          this.allTags['google'][key] = this.result[key];
          break;
        case 'image':
          this.allTags['google'][key] = this.result[key] || this.result['og:image'] || this.result['twitter:image'];
          break;
        case 'title':
          this.allTags = Object.assign({ [key]: this.result[key] }, this.allTags)
          break
        default:
          if (key.includes('og')) {
            this.allTags['facebook'][key] = this.result[key]
          } else if (key.includes('twitter')) {
            this.allTags['twitter'][key] = this.result[key]
          } else {
            this.allTags[key] = this.result[key]
          }
          break;
      }

    })


    console.log(this.allTags)
  }


  copyToClipboard(tag: any, button: any, tooltip: any) {
    const popperInstance = createPopper(button, tooltip, {
      placement: 'top',
    })
    navigator.clipboard.writeText(tag.innerText);
    console.log(tooltip.innerText)
    tooltip.innerText = 'Copied!';
    tooltip.setAttribute('data-show', '');
    button.children[0].setAttribute('class', 'bi bi-check2-all');

    popperInstance.update();



    setTimeout(() => {
      tooltip.innerText = 'Copy to Clipboard!';
      tooltip.removeAttribute('data-show');
      button.children[0].setAttribute('class', 'bi bi-clipboard');
    }, 3500)
  }

  toggleToolTip(button: any, tooltip: any, isShow: boolean) {

    const popperInstance = createPopper(button, tooltip, {
      placement: 'top',
    })

    if (isShow) {

      tooltip.setAttribute('data-show', '');

      popperInstance.update();

    } else {
      tooltip.removeAttribute('data-show');
      popperInstance.update();
    }
  }
}



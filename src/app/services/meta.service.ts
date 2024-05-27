import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
// import * as cheerio from 'cheerio';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  http = inject(HttpClient);


  constructor() { }

  getMetaTags(url:any){

    return this.processMetas(url);
    // return this.http.get<any>(`/api/meta-tags?url=${encodeURIComponent(url)}`, {headers:{'Content-Type': 'application/json'}})
  }


  checkURL(url:any){
    let pattern = new RegExp(this.urlRegex)

    return !!pattern.test(url)
  }

   processMetas(url:string){

    this.getAxios(url).then(
      response =>{
        console.log(response)
        const html = response.data;
        // this.parseHTML(html);
        // const $ = cheerio.load(html);

        // const metaTags:any = {}

        // $('meta').each((i:any, elem:any) =>{
        //   const name = $(elem).attr('name') || $(elem).attr('property');
        //   const content = $(elem).attr('content');

        //   if(name && content){
        //     metaTags[name] = content;
        //   }
        // });

        // metaTags["title"] = $("title").text();

        // return metaTags;
        return 'success'
      }
    ).catch(
      error => {
        console.log(error)
      }
    )

    
  }


  // parseHTML(html: string) {
  //   // Sanitize HTML
  //   const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  
  //   // Create a container element
  //   const container = this.renderer.createElement('div');
  
  //   // Set HTML content to the container
  //   this.renderer.setProperty(container, 'innerHTML', safeHtml.toString());
  
  //   // Now you can use standard DOM methods to manipulate the content
  //   const element = container.querySelector('.some-selector');
  //   console.log(element.textContent);
  // }


  getAxios(url:string):AxiosPromise{
    return axios.get(url);
  }
}

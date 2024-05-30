import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { DomSanitizer, TransferState, makeStateKey } from '@angular/platform-browser';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { firstValueFrom, map, of, tap } from 'rxjs';
import { User } from 'firebase/auth';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { StateService } from './state.service';
import { environment } from 'src/environments/environment';

declare const Zone: any;

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  http = inject(HttpClient);

  data!: string;
  isServer: Boolean;
  baseURL!: string;


  constructor(private state: StateService, @Inject(PLATFORM_ID) platformId: Object, private transferState: TransferState, @Optional() @Inject(REQUEST) private request: any,
  @Inject(DOCUMENT) private document: Document) { 
    this.isServer = isPlatformServer(platformId);
    
    // get base url
    if (this.isServer) {
      this.baseURL = this.request.headers.referer;
    } else {
      this.baseURL = this.document.location.origin + '/';
    }

    // grab data
    // this.getData().then((data) => this.data = data.r);
  }
  async getDatas(url:any): Promise<any> {
    return await firstValueFrom(
      this.http.post(environment.baseURL + '/fetch-meta', {url : url} , {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json'
      })
    );
  };



  getMetaTags(url:any){

    // return this.processMetas(url);
    // return this.http.get<any>(`/api/meta-tags?url=${encodeURIComponent(url)}`, {headers:{'Content-Type': 'application/json'}})
  
    const DATA_KEY = makeStateKey<User | null>('user');

    if (this.transferState.hasKey(DATA_KEY)) {
      const user = this.transferState.get(DATA_KEY, null);
      return of(this.transferState.get(DATA_KEY, null));
    } else {
      return this.http.get(`/api/meta-tags?url=${encodeURIComponent(url)}`, {headers:{'Content-Type': 'application/json'}}).pipe(
        map(data => {
          this.transferState.set(DATA_KEY, data);
          return data;
        })
      );
    }
  }


  checkURL(url:any){
    let pattern = new RegExp(this.urlRegex)

    return !!pattern.test(url)
  }

  async getData(): Promise<void> {

    if (this.isServer) {

      //
      // get data on server, save state
      // get base url from request obj
      //

      const host: string = this.request.get('host');
      this.baseURL = (host.startsWith('localhost') ? 'http://' : 'https://') + host;
      this.data = await this.fetchData();
      this.state.saveState('rest', this.data);

    } else {

      //
      // retrieve state on browser
      // get base url from location obj
      //

      if (this.state.hasState('rest')) {
        this.data = this.state.getState('rest');
      } else {
        this.baseURL = this.document.location.origin;
        this.data = await this.fetchData();
      }
    }
  }

  private async fetchData(): Promise<any> {
    return (
      await firstValueFrom<any>(this.http.get(this.baseURL + '/api/me', {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json'
      }))
    ).r;
  }
}

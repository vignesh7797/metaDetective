import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as cors from 'cors'

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() { }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    config = {
      headers : {
        'Access-Control-Allow-Origin': "*",
        'x-target-url': url
      }
    }
    return axios.get(url, config);
  }

}

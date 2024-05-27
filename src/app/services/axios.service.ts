import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() { }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return axios.get(url, config);
  }

}

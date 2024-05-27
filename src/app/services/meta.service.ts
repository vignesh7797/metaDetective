import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  constructor(private http : HttpClient) { }

  getMetaTags(url:any):Observable<any[]>{
    return this.http.get<any>(`/api/meta-tags?url=${encodeURIComponent(url)}`, {headers:{'Content-Type': 'application/ json'}})
  }


  checkURL(url:any){
    let pattern = new RegExp(this.urlRegex)

    return !!pattern.test(url)
  }
}

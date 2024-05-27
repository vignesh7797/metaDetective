import { Injectable } from '@angular/core';
import cheerio from 'cheerio';

@Injectable({
  providedIn: 'root'
})
export class CheerioService {

  constructor() { }

  parseHTML(html: string) {
    return cheerio.load(html);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ContentComponent } from './content/content.component';
import { ResultComponent } from './result/result.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MetaService } from './services/meta.service';
import { Axios } from 'axios';
import { AxiosService } from './services/axios.service';
import { CheerioService } from './services/cheerio.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ContentComponent,
    ResultComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MetaService, AxiosService, CheerioService, { provide: 'LOCALSTORAGE', useFactory: getLocalStorage }],
  bootstrap: [AppComponent]
})
export class AppModule { }



export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : null;
}

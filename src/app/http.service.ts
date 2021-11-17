import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const localUrl = 'https://corona-api.com/countries';
const globalUrl = 'https://corona-api.com/timeline';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private code = new BehaviorSubject('AF');
  newCode = this.code.asObservable();

  constructor(public http: HttpClient) {}

  getTotalData() {
    return this.http.get(globalUrl);
  }
  getCountryData(code: string) {
    return this.http.get(localUrl + code);
  }
}

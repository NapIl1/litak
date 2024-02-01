import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_URL = 'http://litak-temp-ca.whitedesert-053b82c7.westeurope.azurecontainerapps.io/api';

  constructor(private http: HttpClient) { }

  get() {
    this.http.get(this.API_URL);
  }


}
